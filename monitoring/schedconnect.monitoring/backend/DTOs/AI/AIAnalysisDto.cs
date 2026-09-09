namespace SchedConnect.Monitoring.Models.AI;

public class AIAnalysisDto
{
    public string IncidentId { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string Explanation { get; set; } = string.Empty;

    public string ProbableCause { get; set; } = string.Empty;

    public string Impact { get; set; } = string.Empty;

    public List<string> RecommendedActions { get; set; } = [];

    public string Confidence { get; set; } = string.Empty;

    public DateTime Timestamp { get; set; }
}