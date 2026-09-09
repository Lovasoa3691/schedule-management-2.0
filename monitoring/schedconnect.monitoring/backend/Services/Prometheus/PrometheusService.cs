using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Options;
using SchedConnect.Monitoring.Configuration;
using SchedConnect.Monitoring.Models.Prometheus;

namespace SchedConnect.Monitoring.Services.Prometheus;

public class PrometheusService : IPrometheusService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PrometheusService> _logger;

    public PrometheusService(
        HttpClient httpClient,
        IOptions<PrometheusOptions> options,
        ILogger<PrometheusService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _httpClient.BaseAddress = new Uri(options.Value.Url.TrimEnd('/') + "/");
    }

    public async Task<PrometheusResponse<PrometheusQueryData>> QueryAsync(
        string query,
        CancellationToken cancellationToken = default)
    {
        var encodedQuery = Uri.EscapeDataString(query);

        var response = await _httpClient.GetAsync(
            $"api/v1/query?query={encodedQuery}",
            cancellationToken);

        var content = await response.Content.ReadAsStringAsync(
            cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "Prometheus query failed. StatusCode: {StatusCode}, Response: {Response}",
                response.StatusCode,
                content);

            throw new HttpRequestException(
                $"Prometheus returned {(int)response.StatusCode}.");
        }

        var result =
            JsonSerializer.Deserialize<
                PrometheusResponse<PrometheusQueryData>
            >(content);

        return result
            ?? throw new InvalidOperationException(
                "Prometheus returned an invalid response.");
    }

    public async Task<bool> IsAvailableAsync(
        CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync(
                "api/v1/query?query=up",
                cancellationToken);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Prometheus is currently unavailable.");

            return false;
        }
    }
}