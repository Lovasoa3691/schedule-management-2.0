using SchedConnect.Monitoring.Models.Monitoring;

namespace SchedConnect.Monitoring.Services.Monitoring;

public interface IMonitoringService
{
    Task<MonitoringOverview> GetOverviewAsync(
        CancellationToken cancellationToken = default);
}