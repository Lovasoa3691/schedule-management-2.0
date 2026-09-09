namespace SchedConnect.Monitoring.Models.Metrics;

public class SystemResourceMetric
{
    public double CpuUsagePercentage { get; set; }

    public double MemoryUsedMb { get; set; }

    public DateTime Timestamp { get; set; }
}