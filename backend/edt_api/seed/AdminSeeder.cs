using edt_api.config;
using edt_api.models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace edt_api.seed;

public class AdminSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var passwordHasher = new PasswordHasher<Utilisateur>();
        
        if (await context.Utilisateurs.AnyAsync(u => u.role == "Admin"))
            return;

        var res = new Administrateur
        {
            nom = "FENONANTENAIKO",
            prenom = "Julianot Lovasoa",
            telephone = "+261345416063",
            adresse = "fenomanana",
            genre = "Masculin",
            role = "Admin",
        };
        
        context.Administrateurs.Add(res);
        await context.SaveChangesAsync();

        var hasher = new PasswordHasher<Utilisateur>();
        string hashedPass = hasher.HashPassword(res, "Admin@134");

        var auth = new Authentification
        {
            email = "fenonantenaikolovasoa@gmail.com",
            mdp = hashedPass,
            utilisateurId = res.idUt,
            isActive = true
        };
        
        context.Authentifications.Add(auth);
        await context.SaveChangesAsync();
    }
}