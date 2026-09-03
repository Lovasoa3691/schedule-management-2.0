
using System.Diagnostics;
using schedconnect_monitoring_assistant.Models;

namespace SchedConnect.Monitoring.Api.Services;

public class HealthCheckService
{
    private readonly HttpClient _httpClient;

    public HealthCheckService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ServiceHealth> CheckServiceAsync(
        string name,
        string url)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            using var response = await _httpClient.GetAsync(url);

            stopwatch.Stop();

            return new ServiceHealth
            {
                Name = name,
                Status = response.IsSuccessStatusCode ? "UP" : "DOWN",
                ResponseTimeMs = stopwatch.ElapsedMilliseconds,
                Error = response.IsSuccessStatusCode
                    ? null
                    : $"HTTP {(int)response.StatusCode}"
            };
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            return new ServiceHealth
            {
                Name = name,
                Status = "DOWN",
                ResponseTimeMs = stopwatch.ElapsedMilliseconds,
                Error = ex.Message
            };
        }
    }
}