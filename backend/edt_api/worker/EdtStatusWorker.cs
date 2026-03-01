using edt_api.config;
using Microsoft.EntityFrameworkCore;

namespace edt_api.worker;

public class EdtStatusWorker: BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<EdtStatusWorker> _logger;

    public EdtStatusWorker(IServiceProvider serviceProvider, ILogger<EdtStatusWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Vérification des cours expirés à : {time}", DateTimeOffset.Now);

            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var now = DateTime.Now;
                
                var coursExpires = await db.Edts
                    .Where(e => e.disponibilite == "En cours")
                    .ToListAsync(stoppingToken);

                foreach (var edt in coursExpires)
                {
                    DateTime dateFinCours = edt.jour.ToDateTime(edt.hFin);
                    
                    if (DateTime.Now > dateFinCours.AddMinutes(30))
                    {
                        edt.disponibilite = "Non Pointé"; 
        
                        var activite = await db.Activites
                            .FirstOrDefaultAsync(a => a.matiereId == edt.matiereId 
                                                      && a.enseignantId == edt.enseignantId 
                                                      && a.created_at == edt.created_at
                                                      && a.statusActivite == "En attente");
        
                        if (activite != null)
                        {
                            activite.statusActivite = "Litige";
                            activite.updated_at = DateTime.Now;
                        }
                    }
                }

                await db.SaveChangesAsync(stoppingToken);
            }

            await Task.Delay(TimeSpan.FromMinutes(15), stoppingToken);
        }
    }
}