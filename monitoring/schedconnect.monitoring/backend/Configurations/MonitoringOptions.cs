namespace SchedConnect.Monitoring.Configuration;

public class MonitoringOptions
{
    public const string SectionName = "Monitoring";

    public MonitoringThresholds Thresholds { get; set; } = new();
}

public class MonitoringThresholds
{
    public double ResponseTimeWarningMs { get; set; } = 500;

    public double ResponseTimeCriticalMs { get; set; } = 1000;

    public double ErrorRateWarningPercent { get; set; } = 5;

    public double ErrorRateCriticalPercent { get; set; } = 10;

    public double CpuWarningPercent { get; set; } = 70;

    public double CpuCriticalPercent { get; set; } = 90;
}