namespace SchedConnect.Monitoring.Models.Metrics;

public class HttpMetric
{
    public double RequestsPerSecond { get; set; }

    public double ClientErrorRate { get; set; }

    public double ServerErrorRate { get; set; }

    public double ErrorRate { get; set; }

    public double AverageResponseTimeMs { get; set; }

    public double P95ResponseTimeMs { get; set; }

    public double P99ResponseTimeMs { get; set; }

    public DateTime Timestamp { get; set; }
}