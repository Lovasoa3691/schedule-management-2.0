namespace SchedConnect.Monitoring.DTOs.Metrics;

public class EndpointMetricDto
{
    public string Endpoint { get; set; } = string.Empty;

    public string Method { get; set; } = string.Empty;

    public string Controller { get; set; } = string.Empty;

    public string Action { get; set; } = string.Empty;

    public double RequestsPerSecond { get; set; }

    public double ErrorRate { get; set; }

    public double AverageResponseTimeMs { get; set; }

    public double P95ResponseTimeMs { get; set; }

    public DateTime Timestamp { get; set; }
}