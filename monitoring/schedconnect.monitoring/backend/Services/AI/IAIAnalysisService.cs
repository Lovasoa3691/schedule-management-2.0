using SchedConnect.Monitoring.Models.AI;
using SchedConnect.Monitoring.Models.Incidents;

namespace SchedConnect.Monitoring.Services.AI;

public interface IAIAnalysisService
{
    Task<AIAnalysis> AnalyzeAsync(
        MonitoringIncident incident,
        CancellationToken cancellationToken = default);
}