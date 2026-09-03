using System.Text.Json;

namespace SchedConnect.Monitoring.Api.Services;

public class PrometheusService
{
    private readonly HttpClient _httpClient;

    public PrometheusService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<JsonElement?> QueryAsync(string query)
    {
        var url = $"/api/v1/query?query={Uri.EscapeDataString(query)}";

        var response = await _httpClient.GetAsync(url);

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(json);

        return document.RootElement
            .GetProperty("data")
            .GetProperty("result")
            .Clone();
    }
}