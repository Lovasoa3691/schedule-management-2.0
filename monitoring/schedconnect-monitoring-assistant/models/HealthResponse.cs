namespace schedconnect_monitoring_assistant.Models;

public class HealthResponse
{
    public string Status { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public List<ServiceHealth> Services { get; set; } = new();
}