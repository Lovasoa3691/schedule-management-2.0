using SchedConnect.Monitoring.Models.Alerts;
using SchedConnect.Monitoring.Models.Incidents;
using SchedConnect.Monitoring.Models.Metrics;

namespace SchedConnect.Monitoring.Models.AI;

public class AIAnalysisContext
{
    public MonitoringIncident Incident { get; set; } = new();

    public List<MonitoringAlert> Alerts { get; set; } = [];

    public SchedConnectMetrics? Metrics { get; set; }
}