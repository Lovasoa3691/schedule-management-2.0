#pragma warning disable OPENAI001

using System.Text.Json;
using Microsoft.Extensions.Options;
using OpenAI.Responses;

using SchedConnect.Monitoring.Configuration;
using SchedConnect.Monitoring.Models.AI;
using SchedConnect.Monitoring.Models.Incidents;
using SchedConnect.Monitoring.Services.Alerts;
using SchedConnect.Monitoring.Services.Metrics;

namespace SchedConnect.Monitoring.Services.AI;

public class AIAnalysisService : IAIAnalysisService
{
    private readonly IAlertService _alertService;
    private readonly IMetricsService _metricsService;
    private readonly ILogger<AIAnalysisService> _logger;

    private readonly ResponsesClient _responsesClient;
    private readonly string _model;

    public AIAnalysisService(
        IAlertService alertService,
        IMetricsService metricsService,
        IOptions<AIOptions> options,
        ILogger<AIAnalysisService> logger)
    {
        _alertService = alertService;
        _metricsService = metricsService;
        _logger = logger;

        var aiOptions = options.Value;

        if (string.IsNullOrWhiteSpace(aiOptions.ApiKey))
        {
            throw new InvalidOperationException(
                "AI API key is not configured.");
        }

        _model = string.IsNullOrWhiteSpace(aiOptions.Model)
            ? "gpt-5-mini"
            : aiOptions.Model;

        _responsesClient = new ResponsesClient(
            aiOptions.ApiKey);
    }

    public async Task<AIAnalysis> AnalyzeAsync(
        MonitoringIncident incident,
        CancellationToken cancellationToken = default)
    {
        var alerts =
            await _alertService.GetActiveAlertsAsync(
                cancellationToken);

        var metrics =
            await _metricsService.GetMetricsAsync(
                cancellationToken);

        var context = new AIAnalysisContext
        {
            Incident = incident,

            Alerts = alerts
                .Where(alert =>
                    incident.AlertIds.Contains(alert.Id))
                .ToList(),

            Metrics = metrics
        };

        var prompt = BuildPrompt(context);

        _logger.LogInformation(
            "Sending incident {IncidentId} to AI model {Model}.",
            incident.Id,
            _model);

        try
        {
            var options = new CreateResponseOptions
            {
                Model = _model
            };

            options.InputItems.Add(
                ResponseItem.CreateUserMessageItem(prompt));

            var response =
                await _responsesClient.CreateResponseAsync(
                    options,
                    cancellationToken);

            var output = response.Value.GetOutputText();

            if (string.IsNullOrWhiteSpace(output))
            {
                throw new InvalidOperationException(
                    "AI returned an empty response.");
            }

            return ParseAnalysis(
                incident.Id,
                output);
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "AI analysis failed for incident {IncidentId}.",
                incident.Id);

            throw;
        }
    }

    private static string BuildPrompt(
        AIAnalysisContext context)
    {
        var json = JsonSerializer.Serialize(
            context,
            new JsonSerializerOptions
            {
                WriteIndented = true
            });

        return $$"""
        Tu es l'agent IA de monitoring de SchedConnect,
        une application de gestion d'emploi du temps.

        Analyse l'incident fourni ci-dessous.

        Ton objectif est de produire une analyse technique
        utile à un développeur ou administrateur.

        Tu dois :

        1. expliquer clairement le problème ;
        2. identifier la cause probable ;
        3. expliquer l'impact potentiel ;
        4. proposer des actions concrètes et ordonnées ;
        5. indiquer ton niveau de confiance.

        IMPORTANT :
        - Ne considère jamais une hypothèse comme un fait certain.
        - Si les données sont insuffisantes, indique-le clairement.
        - Ne fabrique aucune métrique.
        - Base ton analyse uniquement sur le contexte fourni.
        - Une recommandation doit être techniquement raisonnable.
        - Distingue clairement observation, hypothèse et recommandation.

        Réponds UNIQUEMENT avec un JSON valide respectant exactement
        cette structure :

        {
          "summary": "Résumé court",
          "explanation": "Explication détaillée",
          "probableCause": "Cause probable",
          "impact": "Impact potentiel",
          "recommendedActions": [
            "Action 1",
            "Action 2"
          ],
          "confidence": "LOW|MEDIUM|HIGH"
        }

        CONTEXTE DU MONITORING :

        {{json}}
        """;
    }

    private static AIAnalysis ParseAnalysis(
        string incidentId,
        string output)
    {
        try
        {
            var analysis =
                JsonSerializer.Deserialize<
                    AIAnalysisResponse>(
                        output,
                        new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

            if (analysis is null)
            {
                throw new InvalidOperationException(
                    "Unable to parse AI response.");
            }

            return new AIAnalysis
            {
                IncidentId = incidentId,

                Summary =
                    analysis.Summary ?? string.Empty,

                Explanation =
                    analysis.Explanation ?? string.Empty,

                ProbableCause =
                    analysis.ProbableCause ?? string.Empty,

                Impact =
                    analysis.Impact ?? string.Empty,

                RecommendedActions =
                    analysis.RecommendedActions ?? [],

                Confidence =
                    NormalizeConfidence(
                        analysis.Confidence),

                Timestamp = DateTime.UtcNow
            };
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "AI returned an invalid JSON response.",
                ex);
        }
    }

    private static string NormalizeConfidence(
        string? confidence)
    {
        return confidence?.ToUpperInvariant() switch
        {
            "HIGH" => "HIGH",
            "MEDIUM" => "MEDIUM",
            "LOW" => "LOW",
            _ => "LOW"
        };
    }

    private sealed class AIAnalysisResponse
    {
        public string? Summary { get; set; }

        public string? Explanation { get; set; }

        public string? ProbableCause { get; set; }

        public string? Impact { get; set; }

        public List<string>? RecommendedActions { get; set; }

        public string? Confidence { get; set; }
    }
}