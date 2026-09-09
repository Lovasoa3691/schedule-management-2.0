using System.Text.Json.Serialization;

namespace SchedConnect.Monitoring.Models.Prometheus;

public class PrometheusQueryData
{
    [JsonPropertyName("resultType")]
    public string ResultType { get; set; } = string.Empty;

    [JsonPropertyName("result")]
    public List<PrometheusResult> Result { get; set; } = [];
}