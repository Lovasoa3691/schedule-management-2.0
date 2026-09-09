using Microsoft.AspNetCore.Mvc;

using SchedConnect.Monitoring.DTOs.Incidents;
using SchedConnect.Monitoring.Services.Incidents;

namespace SchedConnect.Monitoring.Controllers;

[ApiController]
[Route("api/incidents")]
public class IncidentsController : ControllerBase
{
    private readonly IIncidentService _incidentService;

    public IncidentsController(
        IIncidentService incidentService)
    {
        _incidentService = incidentService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(List<MonitoringIncidentDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<MonitoringIncidentDto>>>
        GetActiveIncidents(
            CancellationToken cancellationToken)
    {
        var incidents =
            await _incidentService.GetActiveIncidentsAsync(
                cancellationToken);

        var dto = incidents
            .Select(incident => new MonitoringIncidentDto
            {
                Id = incident.Id,

                Title = incident.Title,

                Description = incident.Description,

                Severity = incident.Severity,

                Status = incident.Status,

                Service = incident.Service,

                Endpoint = incident.Endpoint,

                AlertIds = incident.AlertIds,

                DetectedAt = incident.DetectedAt,

                LastUpdatedAt = incident.LastUpdatedAt
            })
            .ToList();

        return Ok(dto);
    }
}