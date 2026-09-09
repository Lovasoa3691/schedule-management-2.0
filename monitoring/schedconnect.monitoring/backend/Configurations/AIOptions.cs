namespace SchedConnect.Monitoring.Configuration;

public class AIOptions
{
    public const string SectionName = "AI";

    public string ApiKey { get; set; } = string.Empty;

    public string Model { get; set; } = "gpt-5-mini";
}