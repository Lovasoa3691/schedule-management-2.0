namespace SchedConnect.Monitoring.Models.Incidents;

public class MonitoringIncident
{
    public string Id { get; set; } =
        Guid.NewGuid().ToString();

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Severity { get; set; } = string.Empty;

    public string Status { get; set; } = "ACTIVE";

    public string? Service { get; set; }

    public string? Endpoint { get; set; }

    public List<string> AlertIds { get; set; } = [];

    public DateTime DetectedAt { get; set; }

    public DateTime LastUpdatedAt { get; set; }
}