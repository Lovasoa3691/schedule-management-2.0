namespace SchedConnect.Monitoring.Models.Alerts;

public class MonitoringAlert
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string Type { get; set; } = string.Empty;

    public string Severity { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Service { get; set; }

    public string? Endpoint { get; set; }

    public double? CurrentValue { get; set; }

    public double? Threshold { get; set; }

    public DateTime Timestamp { get; set; }
}