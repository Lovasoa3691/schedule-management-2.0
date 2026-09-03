namespace SchedConnect.Monitoring.Api.Models;

public class MetricResponse
{
    public string Metric { get; set; } = string.Empty;
    public object? Value { get; set; }
}