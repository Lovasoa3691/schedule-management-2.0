using SchedConnect.Monitoring.Models.Alerts;

namespace SchedConnect.Monitoring.Services.Alerts;

public interface IAlertService
{
    Task<List<MonitoringAlert>> GetActiveAlertsAsync(
        CancellationToken cancellationToken = default);
}