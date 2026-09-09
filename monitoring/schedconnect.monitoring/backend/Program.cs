using SchedConnect.Monitoring.Configuration;
using SchedConnect.Monitoring.Services.Monitoring;
using SchedConnect.Monitoring.Services.Prometheus;
using SchedConnect.Monitoring.Services.Metrics;
using SchedConnect.Monitoring.Services.Alerts;
using SchedConnect.Monitoring.Services.Incidents;
using SchedConnect.Monitoring.Services.AI;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.Configure<PrometheusOptions>(
    builder.Configuration.GetSection(
        PrometheusOptions.SectionName));

builder.Services.Configure<MonitoringOptions>(
    builder.Configuration.GetSection(
        MonitoringOptions.SectionName));

builder.Services.Configure<AIOptions>(
    builder.Configuration.GetSection(
        AIOptions.SectionName));

builder.Services.AddHttpClient<IPrometheusService,PrometheusService>();

builder.Services.AddScoped<IMonitoringService,MonitoringService>();

builder.Services.AddScoped<IMetricsService, MetricsService>();

builder.Services.AddScoped<IAlertService, AlertService>();

builder.Services.AddScoped<IIncidentService, IncidentService>();

builder.Services.AddScoped<IAIAnalysisService, AIAnalysisService>();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();