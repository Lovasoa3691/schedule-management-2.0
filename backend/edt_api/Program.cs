using System.Text;
using edt_api.config;
using edt_api.seed;
using edt_api.services;
using edt_api.worker;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
// var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
// var dbPort = Environment.GetEnvironmentVariable("DB_PORT");
// var dbName = Environment.GetEnvironmentVariable("DB_NAME");
// var dbUser = Environment.GetEnvironmentVariable("DB_USER");
// var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

// var dbHost = "localhost";
// var dbPort = 3306;
// var dbName = "db_edt_p";
// var dbUser = "orion";
// var dbPassword = "orion3691";
//
// var connectionString =
//     $"Server={dbHost};Port={dbPort};Database={dbName};User={dbUser};Password={dbPassword};";
//
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseMySql(
//         connectionString,
//         ServerVersion.AutoDetect(connectionString)
//     )
// );

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll", policy =>
//     {
//         policy.WithOrigins("http://192.168.49.2:31483","http://192.168.49.2:32395/")
//         // policy.WithOrigins("http://localhost:3000","http://localhost:5142/")
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials();
//     });
// });

var corsOrigins = builder.Configuration["Cors:Origins"]
    .Split(",", StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var serverVersion = new MySqlServerVersion(new Version(8, 0, 35));

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, serverVersion, mySqlOptions =>
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,                          
            maxRetryDelay: TimeSpan.FromSeconds(5), 
            errorNumbersToAdd: null
        )
    )
);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key configuration is missing")))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.ContainsKey("jwt"))
                {
                    context.Token = context.Request.Cookies["jwt"];
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// builder.Services.AddOpenApi();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IUtilisateur, ImUtilisateur>();
builder.Services.AddScoped<IMention, ImMention>();
builder.Services.AddScoped<INiveau, IMNiveau>();
builder.Services.AddScoped<IMatiere, ImMatiere>();
builder.Services.AddScoped<ISalle, IMSalle>();
builder.Services.AddScoped<IDisponibilite, ImDisponibilite>();
builder.Services.AddScoped<IEdt, ImEdt>();
builder.Services.AddScoped<IAnnee, ImAnnee>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHostedService<EdtStatusWorker>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
await AdminSeeder.SeedAsync(app.Services);

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
