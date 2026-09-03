using SchedConnect.Monitoring.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

builder.Services.AddHttpClient<HealthCheckService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(5);
});

builder.Services.AddHttpClient<PrometheusService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:9090");
    client.Timeout = TimeSpan.FromSeconds(5);
});

var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();
app.Run();