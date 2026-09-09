using Microsoft.Extensions.Options;

using SchedConnect.Monitoring.Configuration;
using SchedConnect.Monitoring.Models.Alerts;
using SchedConnect.Monitoring.Services.Metrics;

namespace SchedConnect.Monitoring.Services.Alerts;

public class AlertService : IAlertService
{
    private readonly IMetricsService _metricsService;
    private readonly MonitoringThresholds _thresholds;
    private readonly ILogger<AlertService> _logger;

    public AlertService(
        IMetricsService metricsService,
        IOptions<MonitoringOptions> options,
        ILogger<AlertService> logger)
    {
        _metricsService = metricsService;
        _thresholds = options.Value.Thresholds;
        _logger = logger;
    }

    public async Task<List<MonitoringAlert>> GetActiveAlertsAsync(
        CancellationToken cancellationToken = default)
    {
        var alerts = new List<MonitoringAlert>();

        var metrics =
            await _metricsService.GetMetricsAsync(
                cancellationToken);

        var timestamp = DateTime.UtcNow;

        // ========================================================
        // SERVICE DOWN
        // ========================================================

        if (!metrics.Availability.IsUp)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "SERVICE_DOWN",
                Severity = "CRITICAL",
                Title = "SchedConnect backend is unavailable",
                Description =
                    "Le backend SchedConnect ne répond pas aux vérifications de disponibilité.",
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }

        // ========================================================
        // GLOBAL ERROR RATE
        // ========================================================

        if (metrics.Http.ErrorRate >=
            _thresholds.ErrorRateCriticalPercent)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "HIGH_ERROR_RATE",
                Severity = "CRITICAL",
                Title = "Taux d'erreur HTTP critique",
                Description =
                    "Le taux d'erreur HTTP global dépasse le seuil critique.",
                CurrentValue = metrics.Http.ErrorRate,
                Threshold =
                    _thresholds.ErrorRateCriticalPercent,
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }
        else if (metrics.Http.ErrorRate >=
                 _thresholds.ErrorRateWarningPercent)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "HIGH_ERROR_RATE",
                Severity = "WARNING",
                Title = "Taux d'erreur HTTP élevé",
                Description =
                    "Le taux d'erreur HTTP global dépasse le seuil d'avertissement.",
                CurrentValue = metrics.Http.ErrorRate,
                Threshold =
                    _thresholds.ErrorRateWarningPercent,
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }

        // ========================================================
        // GLOBAL LATENCY
        // ========================================================

        if (metrics.Http.P95ResponseTimeMs >=
            _thresholds.ResponseTimeCriticalMs)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "HIGH_LATENCY",
                Severity = "CRITICAL",
                Title = "Latence HTTP critique",
                Description =
                    "Le temps de réponse P95 dépasse le seuil critique.",
                CurrentValue =
                    metrics.Http.P95ResponseTimeMs,
                Threshold =
                    _thresholds.ResponseTimeCriticalMs,
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }
        else if (metrics.Http.P95ResponseTimeMs >=
                 _thresholds.ResponseTimeWarningMs)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "HIGH_LATENCY",
                Severity = "WARNING",
                Title = "Latence HTTP élevée",
                Description =
                    "Le temps de réponse P95 dépasse le seuil d'avertissement.",
                CurrentValue =
                    metrics.Http.P95ResponseTimeMs,
                Threshold =
                    _thresholds.ResponseTimeWarningMs,
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }

        // ========================================================
        // CPU
        // ========================================================

        if (metrics.System.CpuUsagePercentage >=
            _thresholds.CpuCriticalPercent)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "HIGH_CPU",
                Severity = "CRITICAL",
                Title = "Utilisation CPU critique",
                Description =
                    "L'utilisation CPU du processus SchedConnect dépasse le seuil critique.",
                CurrentValue =
                    metrics.System.CpuUsagePercentage,
                Threshold =
                    _thresholds.CpuCriticalPercent,
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }
        else if (metrics.System.CpuUsagePercentage >=
                 _thresholds.CpuWarningPercent)
        {
            alerts.Add(new MonitoringAlert
            {
                Type = "HIGH_CPU",
                Severity = "WARNING",
                Title = "Utilisation CPU élevée",
                Description =
                    "L'utilisation CPU du processus SchedConnect dépasse le seuil d'avertissement.",
                CurrentValue =
                    metrics.System.CpuUsagePercentage,
                Threshold =
                    _thresholds.CpuWarningPercent,
                Service = metrics.Availability.Service,
                Timestamp = timestamp
            });
        }

        // ========================================================
        // ENDPOINTS
        // ========================================================

        foreach (var endpoint in metrics.Endpoints)
        {
            if (endpoint.ErrorRate >=
                _thresholds.ErrorRateCriticalPercent)
            {
                alerts.Add(new MonitoringAlert
                {
                    Type = "ENDPOINT_HIGH_ERROR_RATE",
                    Severity = "CRITICAL",
                    Title = "Endpoint avec taux d'erreur critique",
                    Description =
                        $"L'endpoint {endpoint.Endpoint} présente un taux d'erreur critique.",
                    Service = metrics.Availability.Service,
                    Endpoint = endpoint.Endpoint,
                    CurrentValue = endpoint.ErrorRate,
                    Threshold =
                        _thresholds.ErrorRateCriticalPercent,
                    Timestamp = timestamp
                });
            }
            else if (endpoint.ErrorRate >=
                     _thresholds.ErrorRateWarningPercent)
            {
                alerts.Add(new MonitoringAlert
                {
                    Type = "ENDPOINT_HIGH_ERROR_RATE",
                    Severity = "WARNING",
                    Title = "Endpoint avec taux d'erreur élevé",
                    Description =
                        $"L'endpoint {endpoint.Endpoint} présente un taux d'erreur élevé.",
                    Service = metrics.Availability.Service,
                    Endpoint = endpoint.Endpoint,
                    CurrentValue = endpoint.ErrorRate,
                    Threshold =
                        _thresholds.ErrorRateWarningPercent,
                    Timestamp = timestamp
                });
            }

            if (endpoint.P95ResponseTimeMs >=
                _thresholds.ResponseTimeCriticalMs)
            {
                alerts.Add(new MonitoringAlert
                {
                    Type = "ENDPOINT_HIGH_LATENCY",
                    Severity = "CRITICAL",
                    Title = "Endpoint avec latence critique",
                    Description =
                        $"L'endpoint {endpoint.Endpoint} présente une latence P95 critique.",
                    Service = metrics.Availability.Service,
                    Endpoint = endpoint.Endpoint,
                    CurrentValue =
                        endpoint.P95ResponseTimeMs,
                    Threshold =
                        _thresholds.ResponseTimeCriticalMs,
                    Timestamp = timestamp
                });
            }
            else if (endpoint.P95ResponseTimeMs >=
                     _thresholds.ResponseTimeWarningMs)
            {
                alerts.Add(new MonitoringAlert
                {
                    Type = "ENDPOINT_HIGH_LATENCY",
                    Severity = "WARNING",
                    Title = "Endpoint avec latence élevée",
                    Description =
                        $"L'endpoint {endpoint.Endpoint} présente une latence P95 élevée.",
                    Service = metrics.Availability.Service,
                    Endpoint = endpoint.Endpoint,
                    CurrentValue =
                        endpoint.P95ResponseTimeMs,
                    Threshold =
                        _thresholds.ResponseTimeWarningMs,
                    Timestamp = timestamp
                });
            }
        }

        _logger.LogInformation(
            "Monitoring detected {AlertCount} active alerts.",
            alerts.Count);

        return alerts;
    }
}