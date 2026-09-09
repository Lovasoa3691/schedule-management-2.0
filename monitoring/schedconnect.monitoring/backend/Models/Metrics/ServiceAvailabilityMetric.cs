namespace SchedConnect.Monitoring.Models.Metrics;

public class ServiceAvailabilityMetric
{
    public string Service { get; set; } = string.Empty;

    public bool IsUp { get; set; }

    public double UptimePercentage { get; set; }

    public DateTime Timestamp { get; set; }
}