using SchedConnect.Monitoring.Models.Prometheus;

namespace SchedConnect.Monitoring.Services.Prometheus;

public interface IPrometheusService
{
    Task<PrometheusResponse<PrometheusQueryData>> QueryAsync(
        string query,
        CancellationToken cancellationToken = default);

    Task<bool> IsAvailableAsync(
        CancellationToken cancellationToken = default);
}