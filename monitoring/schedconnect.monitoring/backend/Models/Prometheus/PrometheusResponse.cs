using System.Text.Json.Serialization;

namespace SchedConnect.Monitoring.Models.Prometheus;

public class PrometheusResponse<T>
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("data")]
    public T? Data { get; set; }

    [JsonPropertyName("errorType")]
    public string? ErrorType { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }
}