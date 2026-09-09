namespace SchedConnect.Monitoring.DTOs.Metrics;

public class SystemResourceMetricDto
{
    public double CpuUsagePercentage { get; set; }

    public double MemoryUsedMb { get; set; }

    public DateTime Timestamp { get; set; }
}