using System.Globalization;
using System.Text.Json;

using SchedConnect.Monitoring.Models.Metrics;
using SchedConnect.Monitoring.Models.Prometheus;
using SchedConnect.Monitoring.Services.Prometheus;

namespace SchedConnect.Monitoring.Services.Metrics;

public class MetricsService : IMetricsService
{
    private const string JobName = "schedconnect-backend";

    private readonly IPrometheusService _prometheusService;
    private readonly ILogger<MetricsService> _logger;

    public MetricsService(
        IPrometheusService prometheusService,
        ILogger<MetricsService> logger)
    {
        _prometheusService = prometheusService;
        _logger = logger;
    }

    public async Task<SchedConnectMetrics> GetMetricsAsync(
        CancellationToken cancellationToken = default)
    {
        var timestamp = DateTime.UtcNow;

        try
        {
            var availabilityTask =
                GetAvailabilityAsync(cancellationToken);

            var httpTask =
                GetHttpMetricsAsync(cancellationToken);

            var systemTask =
                GetSystemMetricsAsync(cancellationToken);

            var endpointTask =
                GetEndpointMetricsAsync(cancellationToken);

            await Task.WhenAll(
                availabilityTask,
                httpTask,
                systemTask,
                endpointTask);

            return new SchedConnectMetrics
            {
                Availability = await availabilityTask,
                Http = await httpTask,
                System = await systemTask,
                Database = new DatabaseMetric
                {
                    IsAvailable = false,
                    Timestamp = timestamp
                },
                Endpoints = await endpointTask,
                Timestamp = timestamp
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Unable to retrieve SchedConnect metrics.");

            throw;
        }
    }

    // ============================================================
    // AVAILABILITY
    // ============================================================

    private async Task<ServiceAvailabilityMetric>
        GetAvailabilityAsync(
            CancellationToken cancellationToken)
    {
        var query =
            $"up{{job=\"{JobName}\"}}";

        var response =
            await _prometheusService.QueryAsync(
                query,
                cancellationToken);

        var result =
            response.Data?.Result.FirstOrDefault();

        var isUp =
            result != null &&
            ExtractValue(result) == 1;

        var serviceName =
            GetLabel(result, "job")
            ?? "SchedConnect";

        return new ServiceAvailabilityMetric
        {
            Service = serviceName,

            IsUp = isUp,

            // Pour l'instant nous avons une valeur instantanée.
            // L'historique réel d'uptime sera ajouté plus tard.
            UptimePercentage = isUp ? 100 : 0,

            Timestamp = DateTime.UtcNow
        };
    }

    // ============================================================
    // HTTP GLOBAL
    // ============================================================

    private async Task<HttpMetric>
        GetHttpMetricsAsync(
            CancellationToken cancellationToken)
    {
        var requestsPerSecondTask =
            QueryValueAsync(
                $@"sum(
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}""}}[5m]
                    )
                )",
                cancellationToken);

        var clientErrorRateTask =
            QueryValueAsync(
                $@"100 *
                sum(
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}"", code=~""4..""}}[5m]
                    )
                )
                /
                sum(
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}""}}[5m]
                    )
                )",
                cancellationToken);

        var serverErrorRateTask =
            QueryValueAsync(
                $@"100 *
                sum(
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}"", code=~""5..""}}[5m]
                    )
                )
                /
                sum(
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}""}}[5m]
                    )
                )",
                cancellationToken);

        var averageResponseTimeTask =
            QueryValueAsync(
                $@"1000 *
                sum(
                    rate(
                        http_request_duration_seconds_sum{{job=""{JobName}""}}[5m]
                    )
                )
                /
                sum(
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}""}}[5m]
                    )
                )",
                cancellationToken);

        var p95Task =
            QueryValueAsync(
                $@"histogram_quantile(
                    0.95,
                    sum(
                        rate(
                            http_request_duration_seconds_bucket{{job=""{JobName}""}}[5m]
                        )
                    ) by (le)
                ) * 1000",
                cancellationToken);

        var p99Task =
            QueryValueAsync(
                $@"histogram_quantile(
                    0.99,
                    sum(
                        rate(
                            http_request_duration_seconds_bucket{{job=""{JobName}""}}[5m]
                        )
                    ) by (le)
                ) * 1000",
                cancellationToken);

        await Task.WhenAll(
            requestsPerSecondTask,
            clientErrorRateTask,
            serverErrorRateTask,
            averageResponseTimeTask,
            p95Task,
            p99Task);

        var requestsPerSecond =
            await requestsPerSecondTask;

        var clientErrorRate =
            await clientErrorRateTask;

        var serverErrorRate =
            await serverErrorRateTask;

        var averageResponseTime =
            await averageResponseTimeTask;

        var p95 =
            await p95Task;

        var p99 =
            await p99Task;

        return new HttpMetric
        {
            RequestsPerSecond = requestsPerSecond,

            ClientErrorRate =
                NormalizePercentage(clientErrorRate),

            ServerErrorRate =
                NormalizePercentage(serverErrorRate),

            ErrorRate =
                NormalizePercentage(
                    clientErrorRate + serverErrorRate),

            AverageResponseTimeMs =
                NormalizeMetric(averageResponseTime),

            P95ResponseTimeMs =
                NormalizeMetric(p95),

            P99ResponseTimeMs =
                NormalizeMetric(p99),

            Timestamp = DateTime.UtcNow
        };
    }

    // ============================================================
    // SYSTEM
    // ============================================================

    private async Task<SystemResourceMetric>
        GetSystemMetricsAsync(
            CancellationToken cancellationToken)
    {
        var cpuTask =
            QueryValueAsync(
                $@"rate(
                    process_cpu_seconds_total{{job=""{JobName}""}}[5m]
                ) * 100",
                cancellationToken);

        var memoryTask =
            QueryValueAsync(
                $@"process_working_set_bytes{{job=""{JobName}""}} / 1024 / 1024",
                cancellationToken);

        await Task.WhenAll(
            cpuTask,
            memoryTask);

        return new SystemResourceMetric
        {
            CpuUsagePercentage =
                NormalizeMetric(await cpuTask),

            MemoryUsedMb =
                NormalizeMetric(await memoryTask),

            Timestamp = DateTime.UtcNow
        };
    }

    // ============================================================
    // ENDPOINTS
    // ============================================================

    private async Task<List<EndpointMetric>>
        GetEndpointMetricsAsync(
            CancellationToken cancellationToken)
    {
        var requestsTask =
            _prometheusService.QueryAsync(
                $@"sum by (
                    endpoint,
                    method,
                    controller,
                    action
                ) (
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}""}}[5m]
                    )
                )",
                cancellationToken);

        var errorsTask =
            _prometheusService.QueryAsync(
                $@"sum by (
                    endpoint,
                    method,
                    controller,
                    action
                ) (
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}"", code=~""[45]..""}}[5m]
                    )
                )",
                cancellationToken);

        var averageLatencyTask =
            _prometheusService.QueryAsync(
                $@"1000 *
                sum by (
                    endpoint,
                    method,
                    controller,
                    action
                ) (
                    rate(
                        http_request_duration_seconds_sum{{job=""{JobName}""}}[5m]
                    )
                )
                /
                sum by (
                    endpoint,
                    method,
                    controller,
                    action
                ) (
                    rate(
                        http_request_duration_seconds_count{{job=""{JobName}""}}[5m]
                    )
                )",
                cancellationToken);

        var p95Task =
            _prometheusService.QueryAsync(
                $@"histogram_quantile(
                    0.95,
                    sum by (
                        endpoint,
                        method,
                        controller,
                        action,
                        le
                    ) (
                        rate(
                            http_request_duration_seconds_bucket{{job=""{JobName}""}}[5m]
                        )
                    )
                ) * 1000",
                cancellationToken);

        await Task.WhenAll(
            requestsTask,
            errorsTask,
            averageLatencyTask,
            p95Task);

        var requests =
            (await requestsTask).Data?.Result ?? [];

        var errors =
            (await errorsTask).Data?.Result ?? [];

        var averageLatencies =
            (await averageLatencyTask).Data?.Result ?? [];

        var p95Latencies =
            (await p95Task).Data?.Result ?? [];

        var endpoints =
            new Dictionary<string, EndpointMetric>(
                StringComparer.OrdinalIgnoreCase);

        // --------------------------------------------------------
        // Requests
        // --------------------------------------------------------

        foreach (var result in requests)
        {
            var key = BuildEndpointKey(result);

            endpoints[key] = new EndpointMetric
            {
                Endpoint =
                    GetLabel(result, "endpoint")
                    ?? "unknown",

                Method =
                    GetLabel(result, "method")
                    ?? "unknown",

                Controller =
                    GetLabel(result, "controller")
                    ?? "unknown",

                Action =
                    GetLabel(result, "action")
                    ?? "unknown",

                RequestsPerSecond =
                    NormalizeMetric(
                        ExtractValue(result)),

                Timestamp = DateTime.UtcNow
            };
        }

        // --------------------------------------------------------
        // Error rate
        // --------------------------------------------------------

        var errorLookup =
            errors.ToDictionary(
                BuildEndpointKey,
                ExtractValue);

        foreach (var endpoint in endpoints.Values)
        {
            if (!errorLookup.TryGetValue(
                    BuildEndpointKey(endpoint),
                    out var errorRate))
            {
                endpoint.ErrorRate = 0;
                continue;
            }

            endpoint.ErrorRate =
                endpoint.RequestsPerSecond > 0
                    ? NormalizePercentage(
                        errorRate /
                        endpoint.RequestsPerSecond *
                        100)
                    : 0;
        }

        // --------------------------------------------------------
        // Average latency
        // --------------------------------------------------------

        foreach (var result in averageLatencies)
        {
            var key =
                BuildEndpointKey(result);

            if (endpoints.TryGetValue(
                    key,
                    out var endpoint))
            {
                endpoint.AverageResponseTimeMs =
                    NormalizeMetric(
                        ExtractValue(result));
            }
        }

        // --------------------------------------------------------
        // P95
        // --------------------------------------------------------

        foreach (var result in p95Latencies)
        {
            var key =
                BuildEndpointKey(result);

            if (endpoints.TryGetValue(
                    key,
                    out var endpoint))
            {
                endpoint.P95ResponseTimeMs =
                    NormalizeMetric(
                        ExtractValue(result));
            }
        }

        return endpoints.Values
            .OrderByDescending(
                endpoint =>
                    endpoint.RequestsPerSecond)
            .ToList();
    }

    // ============================================================
    // PROMETHEUS HELPERS
    // ============================================================

    private async Task<double> QueryValueAsync(
        string query,
        CancellationToken cancellationToken)
    {
        try
        {
            var response =
                await _prometheusService.QueryAsync(
                    query,
                    cancellationToken);

            var result =
                response.Data?.Result.FirstOrDefault();

            if (result == null)
            {
                return 0;
            }

            return ExtractValue(result);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(
                ex,
                "Prometheus query failed: {Query}",
                query);

            return 0;
        }
    }

    private static double ExtractValue(
        PrometheusResult result)
    {
        if (result.Value.Count < 2)
        {
            return 0;
        }

        var value =
            result.Value[1];

        if (value.ValueKind ==
            JsonValueKind.Number)
        {
            return value.GetDouble();
        }

        if (value.ValueKind ==
            JsonValueKind.String &&
            double.TryParse(
                value.GetString(),
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out var parsed))
        {
            return parsed;
        }

        return 0;
    }

    private static string? GetLabel(
        PrometheusResult? result,
        string label)
    {
        if (result?.Metric == null)
        {
            return null;
        }

        return result.Metric.TryGetValue(
            label,
            out var value)
            ? value
            : null;
    }

    private static string BuildEndpointKey(
        PrometheusResult result)
    {
        return string.Join(
            "|",
            GetLabel(result, "endpoint") ?? "unknown",
            GetLabel(result, "method") ?? "unknown",
            GetLabel(result, "controller") ?? "unknown",
            GetLabel(result, "action") ?? "unknown");
    }

    private static string BuildEndpointKey(
        EndpointMetric endpoint)
    {
        return string.Join(
            "|",
            endpoint.Endpoint,
            endpoint.Method,
            endpoint.Controller,
            endpoint.Action);
    }

    private static double NormalizeMetric(
        double value)
    {
        if (double.IsNaN(value) ||
            double.IsInfinity(value))
        {
            return 0;
        }

        return Math.Max(0, value);
    }

    private static double NormalizePercentage(
        double value)
    {
        if (double.IsNaN(value) ||
            double.IsInfinity(value))
        {
            return 0;
        }

        return Math.Clamp(value, 0, 100);
    }
}