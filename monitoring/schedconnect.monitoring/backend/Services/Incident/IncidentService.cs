using SchedConnect.Monitoring.Models.Alerts;
using SchedConnect.Monitoring.Models.Incidents;
using SchedConnect.Monitoring.Services.Alerts;

namespace SchedConnect.Monitoring.Services.Incidents;

public class IncidentService : IIncidentService
{
    private readonly IAlertService _alertService;
    private readonly ILogger<IncidentService> _logger;

    public IncidentService(
        IAlertService alertService,
        ILogger<IncidentService> logger)
    {
        _alertService = alertService;
        _logger = logger;
    }

    public async Task<List<MonitoringIncident>>
        GetActiveIncidentsAsync(
            CancellationToken cancellationToken = default)
    {
        var alerts =
            await _alertService.GetActiveAlertsAsync(
                cancellationToken);

        if (alerts.Count == 0)
        {
            _logger.LogInformation(
                "No active alerts. No incidents detected.");

            return [];
        }

        var incidents = new List<MonitoringIncident>();

        var timestamp = DateTime.UtcNow;

        // ========================================================
        // INCIDENT SERVICE
        // ========================================================

        var serviceAlerts = alerts
            .Where(alert =>
                !string.IsNullOrWhiteSpace(alert.Service))
            .ToList();

        foreach (var group in serviceAlerts
                     .GroupBy(alert => alert.Service))
        {
            var groupedAlerts = group.ToList();

            var severity =
                DetermineSeverity(groupedAlerts);

            incidents.Add(
                new MonitoringIncident
                {
                    Title =
                        "Dégradation du service SchedConnect",

                    Description =
                        BuildServiceDescription(
                            group.Key!,
                            groupedAlerts),

                    Severity = severity,

                    Status = "ACTIVE",

                    Service = group.Key,

                    AlertIds =
                        groupedAlerts
                            .Select(alert => alert.Id)
                            .ToList(),

                    DetectedAt = timestamp,

                    LastUpdatedAt = timestamp
                });
        }

        // ========================================================
        // INCIDENT ENDPOINT
        // ========================================================

        var endpointAlerts = alerts
            .Where(alert =>
                !string.IsNullOrWhiteSpace(alert.Endpoint))
            .GroupBy(alert =>
                new
                {
                    alert.Service,
                    alert.Endpoint
                });

        foreach (var group in endpointAlerts)
        {
            var groupedAlerts =
                group.ToList();

            var severity =
                DetermineSeverity(groupedAlerts);

            incidents.Add(
                new MonitoringIncident
                {
                    Title =
                        $"Problème détecté sur {group.Key.Endpoint}",

                    Description =
                        BuildEndpointDescription(
                            group.Key.Endpoint!,
                            groupedAlerts),

                    Severity = severity,

                    Status = "ACTIVE",

                    Service = group.Key.Service,

                    Endpoint = group.Key.Endpoint,

                    AlertIds =
                        groupedAlerts
                            .Select(alert => alert.Id)
                            .ToList(),

                    DetectedAt = timestamp,

                    LastUpdatedAt = timestamp
                });
        }

        // ========================================================
        // REMOVE DUPLICATE / NESTED INCIDENTS
        // ========================================================

        incidents = incidents
            .OrderByDescending(
                incident =>
                    SeverityWeight(incident.Severity))
            .ToList();

        _logger.LogInformation(
            "Monitoring detected {IncidentCount} active incidents.",
            incidents.Count);

        return incidents;
    }

    // ============================================================
    // DESCRIPTION
    // ============================================================

    private static string BuildServiceDescription(
        string service,
        List<MonitoringAlert> alerts)
    {
        var alertTypes =
            string.Join(
                ", ",
                alerts
                    .Select(alert => alert.Type)
                    .Distinct());

        return
            $"Le service {service} présente " +
            $"un ou plusieurs signaux anormaux : {alertTypes}.";
    }

    private static string BuildEndpointDescription(
        string endpoint,
        List<MonitoringAlert> alerts)
    {
        var descriptions =
            string.Join(
                " ",
                alerts
                    .Select(alert => alert.Description)
                    .Distinct());

        return
            $"L'endpoint {endpoint} présente " +
            $"des anomalies détectées par le système de monitoring. " +
            descriptions;
    }

    // ============================================================
    // SEVERITY
    // ============================================================

    private static string DetermineSeverity(
        List<MonitoringAlert> alerts)
    {
        if (alerts.Any(alert =>
                alert.Severity.Equals(
                    "CRITICAL",
                    StringComparison.OrdinalIgnoreCase)))
        {
            return "CRITICAL";
        }

        if (alerts.Any(alert =>
                alert.Severity.Equals(
                    "WARNING",
                    StringComparison.OrdinalIgnoreCase)))
        {
            return "WARNING";
        }

        return "INFO";
    }

    private static int SeverityWeight(
        string severity)
    {
        return severity.ToUpperInvariant() switch
        {
            "CRITICAL" => 3,
            "WARNING" => 2,
            "INFO" => 1,
            _ => 0
        };
    }
}