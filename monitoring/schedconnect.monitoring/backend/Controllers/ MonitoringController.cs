using Microsoft.AspNetCore.Mvc;
using SchedConnect.Monitoring.DTOs.Monitoring;
using SchedConnect.Monitoring.Services.Monitoring;

namespace SchedConnect.Monitoring.Controllers;

[ApiController]
[Route("api/monitoring")]
public class MonitoringController : ControllerBase
{
    private readonly IMonitoringService _monitoringService;

    public MonitoringController(
        IMonitoringService monitoringService)
    {
        _monitoringService = monitoringService;
    }

    [HttpGet("overview")]
    [ProducesResponseType(
        typeof(MonitoringOverviewDto),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<MonitoringOverviewDto>>
        GetOverview(
            CancellationToken cancellationToken)
    {
        var overview =
            await _monitoringService.GetOverviewAsync(
                cancellationToken);

        var dto = new MonitoringOverviewDto
        {
            Status = overview.Status.ToString(),
            PrometheusAvailable = overview.PrometheusAvailable,
            MonitoredTargets = overview.MonitoredTargets,
            HealthyTargets = overview.HealthyTargets,
            UnhealthyTargets = overview.UnhealthyTargets,
            ErrorRate = overview.ErrorRate,
            AverageResponseTime = overview.AverageResponseTime,
            Timestamp = overview.Timestamp
        };

        return Ok(dto);
    }
}