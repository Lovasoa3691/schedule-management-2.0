using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using schedconnect_monitoring_assistant.Models;
using SchedConnect.Monitoring.Api.Services;

namespace schedconnect_monitoring_assistant.controllers;

[ApiController]
[Route("api/monitoring")]
public class MonitoringController : Controller
{
    private readonly HealthCheckService _healthCheckService;
    private readonly PrometheusService _prometheusService;

    public MonitoringController(
        HealthCheckService healthCheckService,
        PrometheusService prometheusService)
    {
        _healthCheckService = healthCheckService;
        _prometheusService = prometheusService;
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> Metric()
    {
        var result = await _prometheusService.QueryAsync("up");
        return Ok(result);
    }

    [HttpGet("health")]
    public async Task<IActionResult> Health()
    {
        var backend = await _healthCheckService.CheckServiceAsync(
            "SchedConnect Backend",
            "http://localhost");

        var prometheus = await _healthCheckService.CheckServiceAsync(
            "Prometheus",
            "http://localhost:9090/-/healthy");

        var services = new List<ServiceHealth>
        {
            backend,
            prometheus
        };

        var overallStatus = services.All(x => x.Status == "UP")
            ? "UP"
            : "DEGRADED";

        var result = new HealthResponse
        {
            Status = overallStatus,
            Timestamp = DateTime.UtcNow,
            Services = services
        };

        return Ok(result);
    }
}