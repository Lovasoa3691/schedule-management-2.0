

using edt_api.models;
using Microsoft.EntityFrameworkCore;

namespace edt_api.config;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Responsable> Responsables => Set<Responsable>();
    public DbSet<Edt> Edts => Set<Edt>();
    public DbSet<Salle> Salles => Set<Salle>();
    public DbSet<Disponibilite> Disponibilites => Set<Disponibilite>();
    public DbSet<Enseignant> Enseignants => Set<Enseignant>();
    public DbSet<Administrateur> Administrateurs => Set<Administrateur>();
    public DbSet<Matiere> Matieres => Set<Matiere>();
    public DbSet<Mention> Mentions => Set<Mention>();
    public DbSet<Niveau> Niveaux => Set<Niveau>();
    public DbSet<Utilisateur> Utilisateurs => Set<Utilisateur>();
    public DbSet<Authentification> Authentifications => Set<Authentification>();
    public DbSet<CalendrierAcademique>  CalendrierAcademiques => Set<CalendrierAcademique>();
    public DbSet<Message>  Messages => Set<Message>();
    public DbSet<AnneeScolaire>  AnneeScolaires => Set<AnneeScolaire>();
    public DbSet<Activite> Activites => Set<Activite>();
    public DbSet<MatiereMention> MatiereMentions => Set<MatiereMention>();
    public DbSet<MatiereNiveau> MatiereNiveaux => Set<MatiereNiveau>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Activite>()
            .HasKey(e => e.idActivite);

        modelBuilder.Entity<Matiere>()
            .HasKey(m => m.codeMat);

        // modelBuilder.Entity<Activite>()
        //     .HasOne(e => e.enseignant)
        //     .WithMany(e => e.activites)
        //     .HasForeignKey(e => e.enseignantId);
        //
        // modelBuilder.Entity<Activite>()
        //     .HasOne(e => e.matiere)
        //     .WithMany(m => m.activites)
        //     .HasForeignKey(e => e.matiereId);
        
        // modelBuilder.Entity<Activite>()
        //     .HasIndex(e => new { e.enseignantId, e.matiereId })
        //     .IsUnique();
        
        modelBuilder.Entity<MatiereMention>()
            .HasKey(m => new { m.matiereId, m.mentionId});
        
        modelBuilder.Entity<MatiereNiveau>()
            .HasKey(m => new { m.matiereId, m.niveauId});

        modelBuilder.Entity<Utilisateur>()
            .HasDiscriminator<string>("typeUtilisateur")
            .HasValue<Administrateur>("Administrateur")
            .HasValue<Responsable>("Responsable")
            .HasValue<Enseignant>("Enseignant");

        modelBuilder.Entity<Authentification>()
            .HasOne(a => a.utilisateur)
            .WithMany(u => u.Authentifications)
            .HasForeignKey(a => a.utilisateurId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Activite>()
            .HasOne(e => e.enseignant)
            .WithMany(m => m.activites)
            .HasForeignKey(e => e.enseignantId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Activite>()
            .HasOne(e => e.matiere)
            .WithMany(m => m.activites)
            .HasForeignKey(e => e.matiereId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Message>()
            .HasOne(r => r.responsable)
            .WithMany(m => m.messages)
            .HasForeignKey(r => r.responsableId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Message>()
            .HasOne(r => r.enseignant)
            .WithMany(m => m.messages)
            .HasForeignKey(r => r.enseignantId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Edt>()
            .HasOne(e => e.responsable)
            .WithMany(r => r.edts)
            .HasForeignKey(e => e.responsableId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Edt>()
            .HasOne(e => e.anneeScolaire)
            .WithMany(n => n.edts)
            .HasForeignKey(e => e.anneeId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Edt>()
            .HasOne(e => e.mention)
            .WithMany(m => m.edts)
            .HasForeignKey(r => r.mentionId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Edt>()
            .HasOne(e => e.niveau)
            .WithMany(m => m.edts)
            .HasForeignKey(r => r.niveauId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Edt>()
            .HasOne(e => e.salle)
            .WithMany(s => s.edts)
            .HasForeignKey(e => e.salleId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Edt>()
            .HasOne(e => e.enseignant)
            .WithMany(s => s.edts)
            .HasForeignKey(e => e.enseignantId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Edt>()
            .HasOne(e => e.matiere)
            .WithMany(s => s.edts)
            .HasForeignKey(e => e.matiereId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<Disponibilite>()
            .HasOne(d => d.enseignant)
            .WithMany(s => s.disponibilites)
            .HasForeignKey(d => d.enseignantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<MatiereMention>()
            .HasOne(m => m.matiere)
            .WithMany(m => m.matiereMention)
            .HasForeignKey(m => m.matiereId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatiereMention>()
            .HasOne(m => m.mention)
            .WithMany(m => m.matiereMention)
            .HasForeignKey(m => m.mentionId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<MatiereNiveau>()
            .HasOne(m => m.matiere)
            .WithMany(m => m.matiereNiveau)
            .HasForeignKey(m => m.matiereId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MatiereNiveau>()
            .HasOne(m => m.niveau)
            .WithMany(m => m.matiereNiveau)
            .HasForeignKey(m => m.niveauId)
            .OnDelete(DeleteBehavior.Cascade);;
        
    }
}