using SchedConnect.Monitoring.Models.Monitoring;
using SchedConnect.Monitoring.Services.Prometheus;

namespace SchedConnect.Monitoring.Services.Monitoring;

public class MonitoringService : IMonitoringService
{
    private readonly IPrometheusService _prometheusService;
    private readonly ILogger<MonitoringService> _logger;

    public MonitoringService(
        IPrometheusService prometheusService,
        ILogger<MonitoringService> logger)
    {
        _prometheusService = prometheusService;
        _logger = logger;
    }

    public async Task<MonitoringOverview> GetOverviewAsync(
        CancellationToken cancellationToken = default)
    {
        var timestamp = DateTime.UtcNow;

        var prometheusAvailable =
            await _prometheusService.IsAvailableAsync(
                cancellationToken);

        if (!prometheusAvailable)
        {
            return new MonitoringOverview
            {
                Status = MonitoringStatus.Unknown,
                PrometheusAvailable = false,
                MonitoredTargets = 0,
                HealthyTargets = 0,
                UnhealthyTargets = 0,
                ErrorRate = 0,
                AverageResponseTime = 0,
                Timestamp = timestamp
            };
        }

        try
        {
            var result = await _prometheusService.QueryAsync(
                "up",
                cancellationToken);

            var targets = result.Data?.Result ?? [];

            var monitoredTargets = targets.Count;

            var healthyTargets = targets.Count(target =>
                target.Value.Count >= 2 &&
                target.Value[1].GetString() == "1");

            var unhealthyTargets =
                monitoredTargets - healthyTargets;

            var status = DetermineStatus(
                monitoredTargets,
                healthyTargets);

            return new MonitoringOverview
            {
                Status = status,
                PrometheusAvailable = true,
                MonitoredTargets = monitoredTargets,
                HealthyTargets = healthyTargets,
                UnhealthyTargets = unhealthyTargets,
                ErrorRate = 0,
                AverageResponseTime = 0,
                Timestamp = timestamp
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unable to build monitoring overview.");

            return new MonitoringOverview
            {
                Status = MonitoringStatus.Unknown,
                PrometheusAvailable = true,
                Timestamp = timestamp
            };
        }
    }

    private static MonitoringStatus DetermineStatus(
        int total,
        int healthy)
    {
        if (total == 0)
            return MonitoringStatus.Unknown;

        if (healthy == total)
            return MonitoringStatus.Healthy;

        if (healthy == 0)
            return MonitoringStatus.Critical;

        return MonitoringStatus.Degraded;
    }
}