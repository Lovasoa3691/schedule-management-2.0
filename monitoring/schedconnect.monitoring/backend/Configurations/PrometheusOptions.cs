namespace SchedConnect.Monitoring.Configuration;

public class PrometheusOptions
{
    public const string SectionName = "Prometheus";

    public string Url { get; set; } = "http://localhost:9090";
}