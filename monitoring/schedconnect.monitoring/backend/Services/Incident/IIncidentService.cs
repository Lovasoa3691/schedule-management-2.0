using SchedConnect.Monitoring.Models.Incidents;

namespace SchedConnect.Monitoring.Services.Incidents;

public interface IIncidentService
{
    Task<List<MonitoringIncident>> GetActiveIncidentsAsync(
        CancellationToken cancellationToken = default);
}