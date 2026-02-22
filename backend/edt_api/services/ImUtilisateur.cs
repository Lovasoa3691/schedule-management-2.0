using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using edt_api.config;
using edt_api.dtos;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using edt_api.models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace edt_api.services;

public class ImUtilisateur : IUtilisateur
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;
    private readonly IConfiguration _config;
    
    public ImUtilisateur(AppDbContext db, IMapper mapper, IConfiguration config)
    {
        _db = db;
        _mapper = mapper;
        _config = config;
    }
    
    public async Task<IEnumerable<ResponsableDto>> getAllAsync()
    {
        var responsable = await _db.Responsables.Include(r => r.Authentifications).ToListAsync();
        return _mapper.Map<IEnumerable<ResponsableDto>>(responsable);
    }

    public async Task<IEnumerable<EnseignantDto>> getAllTeacherAsync()
    {
        var enseignant = await _db.Enseignants.Include(e => e.Authentifications).ToListAsync();
        return _mapper.Map<IEnumerable<EnseignantDto>>(enseignant);
    }

    public async Task<IEnumerable<EnseignantActiviteDto>> getSpecificTeacher()
    {
        var activites = await _db.Activites
            .Include(a => a.enseignant)
            .Include(a => a.matiere)
            .ToListAsync();
        return _mapper.Map<IEnumerable<EnseignantActiviteDto>>(activites);
    }
    
    public async Task<IEnumerable<EnseignantInfoDto>> getInfoTeacherAsync(string id)
    {
        List<Enseignant> info = new List<Enseignant>();
        
        if (id == "all")
        {
            info = await _db.Enseignants
                .Include(e => e.activites)
                .ThenInclude(ens => ens.matiere)
                .Include(e => e.Authentifications)
                .ToListAsync();
        }
        else
        {
            info = await _db.Enseignants
                .Include(e => e.activites)
                .ThenInclude(ens => ens.matiere)
                .Include(e => e.Authentifications)
                .Where(e => e.idUt == id)
                .ToListAsync();
        }

        var grouped = info.Select(e =>
            new EnseignantInfoDto
            (
                nom: e.nom,
                prenom: e.prenom,
                grade: e.grade,
                email: e.Authentifications?.FirstOrDefault()?.email ?? "N/A",
                matiereInfo: e.activites
                    .GroupBy(ens => ens.matiere?.nomMat ?? "N/A")
                    .Select(g => new MatiereInfoDto
                    (
                        matiere: g.Key,
                        hPrevue: g.FirstOrDefault()?.matiere?.nbHor ?? 0,
                        hEffectue: g
                            .Where(ens => ens.statusActivite == "Accompli")
                            .Sum(ens => ens.heureEffectue)
                    )).ToList()
            ));
        return grouped;
    }

    public async Task<IEnumerable<UserDto>> getByIdAsync(string id, string role)
    {
        var res = await _db.Utilisateurs.Include(a => a.Authentifications).Where(e=> e.idUt == id && e.role == role).ToListAsync();
        if (res == null) return null;
        return _mapper.Map<IEnumerable<UserDto>>(res);
    }
    
    public Utilisateur? GetUtilisateurById(string id)
    {
        return _db.Utilisateurs.FirstOrDefault(u => u.idUt == id);
    }

    public async Task<AuthDto> getUserConnected(LoginDto dto)
    {
        var res = await _db.Authentifications
            .Where(e => e.email == dto.email)
            .FirstOrDefaultAsync();
        
        if (res == null) return null;
        
        var hasher = new PasswordHasher<Authentification>();
        var result = hasher.VerifyHashedPassword(res, res.mdp, dto.mdp);

        if (result != PasswordVerificationResult.Success) return null;

        var users = await _db.Utilisateurs
            .FirstOrDefaultAsync(i => i.idUt == res.utilisateurId);

        if (users == null) return null;

        string role = users switch
        {
            Responsable => users.role,
            Enseignant => users.role,
            Administrateur => users.role,
            _ => "utilisateur"
        };
        
        var claims = new[]
        {
            new Claim("userId", res.utilisateurId),
            new Claim("email", res.email),
            new Claim("role", role)
        };
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(2),
            signingCredentials: creds
        );
        
        string jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
        
        return new AuthDto(res.email, role, jwtToken);
    }

    public async Task<ResponsableDto> createAsync(CreateResponsableDto dto)
    {
        var res = new Responsable
        {
            nom = dto.nom,
            prenom = dto.prenom,
            telephone = dto.phone,
            adresse = dto.adresse,
            genre = dto.genre,
            role = dto.fonction,
        };
        
        _db.Responsables.Add(res);
        await _db.SaveChangesAsync();

        // var hasher = new PasswordHasher<Utilisateur>();
        // string hashedPass = hasher.HashPassword(res, dto.mdp);

        var auth = new Authentification
        {
            email = dto.email,
            mdp = "",
            utilisateurId = res.idUt,
            isActive = false
        };
        
        _db.Authentifications.Add(auth);
        await _db.SaveChangesAsync();

        return new ResponsableDto(
            res.idUt,
            res.nom,
            res.prenom,
            res.telephone,
            res.role,
            res.genre,
            res.adresse,
            auth.email
        );
    }
    
    public async Task<EnseignantDto> addAsync(CreateEnseignantDto dto)
    {
        // var res = _mapper.Map<Enseignant>(dto);
        // await _db.Enseignants.AddAsync(res);
        // await _db.SaveChangesAsync();
        // return _mapper.Map<EnseignantDto>(res);
        var res = new Enseignant()
        {
            nom = dto.nom,
            prenom = dto.prenom,
            telephone = dto.phone,
            adresse = dto.adresse,
            genre = dto.genre,
            grade = dto.grade,
        };
        
        _db.Enseignants.Add(res);
        await _db.SaveChangesAsync();

        var auth = new Authentification
        {
            email = dto.email,
            mdp = "",
            utilisateurId = res.idUt,
            isActive = false
        };
        
        _db.Authentifications.Add(auth);
        await _db.SaveChangesAsync();

        return new EnseignantDto(
            res.idUt,
            res.nom,
            res.prenom,
            res.telephone,
            res.grade,
            res.genre,
            res.adresse,
            auth.email
        );
    }

    public async Task<EnseignantDto?> registerAsync(RegisterEnseignantDto dto)
    {
        List<EnseignantDto> res = new List<EnseignantDto>();
        
        var auth = await _db.Authentifications
            .FirstOrDefaultAsync(a => a.email == dto.email);
        
        if (auth == null)
            return null; 
        
        if (!string.IsNullOrEmpty(auth.mdp))
            throw new Exception("Compte déjà activé");
        
        var hasher = new PasswordHasher<Utilisateur>();
        var hashedPassword = hasher.HashPassword(null!, dto.mdp);
        
        auth.mdp = hashedPassword;
        auth.isActive = true;
        
        await _db.SaveChangesAsync();
         
        var enseignant = await _db.Enseignants.FirstAsync(e => e.idUt == auth.utilisateurId);
        res.Add(new EnseignantDto(
            enseignant.idUt,
            enseignant.nom,
            enseignant.prenom,
            enseignant.telephone,
            enseignant.grade,
            enseignant.genre,
            enseignant.adresse,
            ""
            // checked_info.Authentifications.Select(e => e.email)
            // auth.email
        ));

        return res.First();
    }

    public async Task<bool> updateAsync(string id, UpdateResponsableDto dto)
    {
        var res = await _db.Responsables.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        await _db.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> updateTeacherAsync(string id, UpdateEnseignantDto dto)
    {
        var res = await _db.Enseignants.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> deleteAsync(string id)
    {
        var res = await _db.Responsables.FindAsync(id);
        if (res == null) return false;
        
        _db.Responsables.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> deleteTeacherAsync(string id)
    {
        var res = await _db.Enseignants.FindAsync(id);
        if (res == null) return false;
        
        _db.Enseignants.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
}