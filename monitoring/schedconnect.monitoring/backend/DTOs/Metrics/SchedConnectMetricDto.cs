namespace SchedConnect.Monitoring.DTOs.Metrics;

public class SchedConnectMetricsDto
{
    public ServiceAvailabilityMetricDto Availability { get; set; } = new();

    public HttpMetricDto Http { get; set; } = new();

    public SystemResourceMetricDto System { get; set; } = new();

    public DatabaseMetricDto Database { get; set; } = new();

    public List<EndpointMetricDto> Endpoints { get; set; } = [];

    public DateTime Timestamp { get; set; }
}