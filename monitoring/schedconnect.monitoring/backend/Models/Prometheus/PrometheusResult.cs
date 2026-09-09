using System.Text.Json;
using System.Text.Json.Serialization;

namespace SchedConnect.Monitoring.Models.Prometheus;

public class PrometheusResult
{
    [JsonPropertyName("metric")]
    public Dictionary<string, string> Metric { get; set; } = [];

    [JsonPropertyName("value")]
    public List<JsonElement> Value { get; set; } = [];

    [JsonPropertyName("values")]
    public List<List<JsonElement>> Values { get; set; } = [];
}