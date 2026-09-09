using Microsoft.AspNetCore.Mvc;
using SchedConnect.Monitoring.DTOs.Metrics;
using SchedConnect.Monitoring.Services.Metrics;

namespace SchedConnect.Monitoring.Controllers;

[ApiController]
[Route("api/metrics")]
public class MetricsController : ControllerBase
{
    private readonly IMetricsService _metricsService;

    public MetricsController(
        IMetricsService metricsService)
    {
        _metricsService = metricsService;
    }

    [HttpGet]
    [ProducesResponseType(
        typeof(SchedConnectMetricsDto),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<SchedConnectMetricsDto>> GetMetrics(
        CancellationToken cancellationToken)
    {
        var metrics =
            await _metricsService.GetMetricsAsync(
                cancellationToken);

        var dto = new SchedConnectMetricsDto
        {
            Availability = new ServiceAvailabilityMetricDto
            {
                Service = metrics.Availability.Service,
                IsUp = metrics.Availability.IsUp,
                UptimePercentage =
                    metrics.Availability.UptimePercentage,
                Timestamp = metrics.Availability.Timestamp
            },

            Http = new HttpMetricDto
            {
                RequestsPerSecond =
                    metrics.Http.RequestsPerSecond,

                ClientErrorRate =
                    metrics.Http.ClientErrorRate,

                ServerErrorRate =
                    metrics.Http.ServerErrorRate,

                ErrorRate =
                    metrics.Http.ErrorRate,

                AverageResponseTimeMs =
                    metrics.Http.AverageResponseTimeMs,

                P95ResponseTimeMs =
                    metrics.Http.P95ResponseTimeMs,

                P99ResponseTimeMs =
                    metrics.Http.P99ResponseTimeMs,

                Timestamp = metrics.Http.Timestamp
            },

            System = new SystemResourceMetricDto
            {
                CpuUsagePercentage =
                    metrics.System.CpuUsagePercentage,

                MemoryUsedMb =
                    metrics.System.MemoryUsedMb,

                Timestamp =
                    metrics.System.Timestamp
            },

            Database = new DatabaseMetricDto
            {
                IsAvailable =
                    metrics.Database.IsAvailable,

                ActiveConnections =
                    metrics.Database.ActiveConnections,

                IdleConnections =
                    metrics.Database.IdleConnections,

                AverageQueryDurationMs =
                    metrics.Database.AverageQueryDurationMs,

                FailedQueries =
                    metrics.Database.FailedQueries,

                Timestamp =
                    metrics.Database.Timestamp
            },

            Endpoints = metrics.Endpoints
                .Select(endpoint => new EndpointMetricDto
                {
                    Endpoint = endpoint.Endpoint,
                    Method = endpoint.Method,
                    Controller = endpoint.Controller,
                    Action = endpoint.Action,

                    RequestsPerSecond =
                        endpoint.RequestsPerSecond,

                    ErrorRate =
                        endpoint.ErrorRate,

                    AverageResponseTimeMs =
                        endpoint.AverageResponseTimeMs,

                    P95ResponseTimeMs =
                        endpoint.P95ResponseTimeMs,

                    Timestamp =
                        endpoint.Timestamp
                })
                .ToList(),

            Timestamp = metrics.Timestamp
        };

        return Ok(dto);
    }

    [HttpGet("endpoints")]
    [ProducesResponseType(
        typeof(List<EndpointMetricDto>),
        StatusCodes.Status200OK)]
    public async Task<ActionResult<List<EndpointMetricDto>>>
        GetEndpoints(
            CancellationToken cancellationToken)
    {
        var metrics =
            await _metricsService.GetMetricsAsync(
                cancellationToken);

        var endpoints = metrics.Endpoints
            .Select(endpoint => new EndpointMetricDto
            {
                Endpoint = endpoint.Endpoint,
                Method = endpoint.Method,
                Controller = endpoint.Controller,
                Action = endpoint.Action,

                RequestsPerSecond =
                    endpoint.RequestsPerSecond,

                ErrorRate =
                    endpoint.ErrorRate,

                AverageResponseTimeMs =
                    endpoint.AverageResponseTimeMs,

                P95ResponseTimeMs =
                    endpoint.P95ResponseTimeMs,

                Timestamp =
                    endpoint.Timestamp
            })
            .ToList();

        return Ok(endpoints);
    }
}