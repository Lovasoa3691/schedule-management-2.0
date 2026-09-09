using Microsoft.AspNetCore.Mvc;
using SchedConnect.Monitoring.Services.AI;
using SchedConnect.Monitoring.Services.Incidents;
using SchedConnect.Monitoring.Models.AI;

namespace SchedConnect.Monitoring.Controllers;

[ApiController]
[Route("api/ai")]
public class AIController : ControllerBase
{
    private readonly IIncidentService _incidentService;
    private readonly IAIAnalysisService _aiAnalysisService;

    public AIController(
        IIncidentService incidentService,
        IAIAnalysisService aiAnalysisService)
    {
        _incidentService = incidentService;
        _aiAnalysisService = aiAnalysisService;
    }

    [HttpGet("incidents/{incidentId}/analysis")]
    [ProducesResponseType(
        typeof(AIAnalysisDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AIAnalysisDto>> AnalyzeIncident(
        string incidentId,
        CancellationToken cancellationToken)
    {
        var incidents =
            await _incidentService.GetActiveIncidentsAsync(
                cancellationToken);

        var incident = incidents.FirstOrDefault(
            item => item.Id == incidentId);

        if (incident is null)
        {
            return NotFound(new
            {
                message = $"Incident '{incidentId}' introuvable."
            });
        }

        var analysis =
            await _aiAnalysisService.AnalyzeAsync(
                incident,
                cancellationToken);

        var dto = new AIAnalysisDto
        {
            IncidentId = analysis.IncidentId,
            Summary = analysis.Summary,
            Explanation = analysis.Explanation,
            ProbableCause = analysis.ProbableCause,
            Impact = analysis.Impact,
            RecommendedActions =
                analysis.RecommendedActions,
            Confidence = analysis.Confidence,
            Timestamp = analysis.Timestamp
        };

        return Ok(dto);
    }
}