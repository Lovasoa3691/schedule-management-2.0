namespace SchedConnect.Monitoring.Models.Metrics;

public class SchedConnectMetrics
{
    public ServiceAvailabilityMetric Availability { get; set; } = new();

    public HttpMetric Http { get; set; } = new();

    public SystemResourceMetric System { get; set; } = new();

    public DatabaseMetric Database { get; set; } = new();

    public List<EndpointMetric> Endpoints { get; set; } = [];

    public DateTime Timestamp { get; set; }
}