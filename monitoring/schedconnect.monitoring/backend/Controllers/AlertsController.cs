using Microsoft.AspNetCore.Mvc;

using SchedConnect.Monitoring.DTOs.Alerts;
using SchedConnect.Monitoring.Services.Alerts;

namespace SchedConnect.Monitoring.Controllers;

[ApiController]
[Route("api/alerts")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alertService;

    public AlertsController(
        IAlertService alertService)
    {
        _alertService = alertService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<MonitoringAlertDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<MonitoringAlertDto>>> GetActiveAlerts(
        CancellationToken cancellationToken)
    {
        var alerts =
            await _alertService.GetActiveAlertsAsync(
                cancellationToken);

        var dto = alerts
            .Select(alert => new MonitoringAlertDto
            {
                Id = alert.Id,

                Type = alert.Type,

                Severity = alert.Severity,

                Title = alert.Title,

                Description = alert.Description,

                Service = alert.Service,

                Endpoint = alert.Endpoint,

                CurrentValue = alert.CurrentValue,

                Threshold = alert.Threshold,

                Timestamp = alert.Timestamp
            })
            .ToList();

        return Ok(dto);
    }
}