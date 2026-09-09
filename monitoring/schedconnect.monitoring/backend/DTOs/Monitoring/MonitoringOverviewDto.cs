namespace SchedConnect.Monitoring.DTOs.Monitoring;

public class MonitoringOverviewDto
{
    public string Status { get; set; } = string.Empty;

    public bool PrometheusAvailable { get; set; }

    public int MonitoredTargets { get; set; }

    public int HealthyTargets { get; set; }

    public int UnhealthyTargets { get; set; }

    public double ErrorRate { get; set; }

    public double AverageResponseTime { get; set; }

    public DateTime Timestamp { get; set; }
}