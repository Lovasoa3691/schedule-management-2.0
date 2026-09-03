namespace schedconnect_monitoring_assistant.Models;

public class ServiceHealth
{
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public long ResponseTimeMs { get; set; }
    public string? Error { get; set; }
}