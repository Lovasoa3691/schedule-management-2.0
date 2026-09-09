using SchedConnect.Monitoring.Models.Metrics;

namespace SchedConnect.Monitoring.Services.Metrics;

public interface IMetricsService
{
    Task<SchedConnectMetrics> GetMetricsAsync(
        CancellationToken cancellationToken = default);
}