namespace SchedConnect.Monitoring.DTOs.Incidents;

public class MonitoringIncidentDto
{
    public string Id { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Severity { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string? Service { get; set; }

    public string? Endpoint { get; set; }

    public List<string> AlertIds { get; set; } = [];

    public DateTime DetectedAt { get; set; }

    public DateTime LastUpdatedAt { get; set; }
}