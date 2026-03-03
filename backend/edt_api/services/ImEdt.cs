using System.Runtime.InteropServices;
using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace edt_api.services;

public class ImEdt : IEdt
{

    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ImEdt(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<EdtDto>> GetAllAsync(
        string id,
        DateOnly? startDate = null,
        DateOnly? endDate = null)
    {
        IQueryable<Edt> query = _db.Edts
            .AsNoTracking()
            .Include(e => e.enseignant)
            .ThenInclude(ee => ee.activites)
            .Include(a => a.matiere)
            .Include(m => m.mention)
            .Include(n => n.niveau)
            .Include(s => s.salle)
            .Include(a => a.anneeScolaire);

        if (id != "all")
        {
            if (startDate.HasValue && endDate.HasValue)
            {
                query = query.Where(e => e.enseignantId == id && e.jour >= startDate.Value && e.jour <= endDate.Value && e.anneeScolaire.status == "Active");
            }
            else
            {
                query = query.Where(e => e.enseignantId == id && e.anneeScolaire.status == "Active");
            }
        }
        else
        {
            if (startDate.HasValue && endDate.HasValue)
            {
                query = query.Where(e => e.jour >= startDate.Value && e.jour <= endDate.Value && e.anneeScolaire.status == "Active");
            }
            else
            {
                query = query.Where(e => e.anneeScolaire.status == "Active");
            }
        }
        var result = await query.ToListAsync();
        return _mapper.Map<IEnumerable<EdtDto>>(result);
    }

    public async Task<IEnumerable<EdtDto>> GetEdtByWeek(string id, string week)
    {
        IQueryable<Edt> query = _db.Edts
            .AsNoTracking()
            .Include(e => e.enseignant)
            .ThenInclude(ee => ee.activites)
            .Include(a => a.matiere)
            .Include(m => m.mention)
            .Include(n => n.niveau)
            .Include(s => s.salle)
            .Include(a => a.anneeScolaire)
            .Where(e => e.anneeScolaire.status == "Active" && e.enseignantId == id && e.semaine == week)
            .OrderBy(o => o.jour)
            .ThenBy(o => o.hDeb)
            .ThenBy(o => o.hFin);

        var result = await query.ToListAsync();
        return _mapper.Map<IEnumerable<EdtDto>>(result);
    }

    public async Task<EdtDto?> GetByIdAsync(string id)
    {
        var res = await _db.Edts.FindAsync(id);
       return res ==  null ? null : _mapper.Map<EdtDto>(res);
    }
    
    public async Task<bool> CheckConflitAsync(CreateEdtDto dto)
    {
        var conflit = await _db.Edts
            .Where(e => e.jour == dto.jour)
            .Where(e => e.hDeb < dto.hFin && e.hFin > dto.hDeb) 
            .Where(e =>
                    e.enseignantId == dto.enseignantId || 
                    e.salleId == dto.idSalle ||         
                    (e.mentionId == dto.mentionId && e.niveauId == dto.niveauId)
            )
            .FirstOrDefaultAsync();

        return conflit != null;
    }

    public async Task<string> GetConflictMessageAsync(CreateEdtDto dto)
    {
        var existingEdt = await _db.Edts
            // .Include(e => e.enseignant)
            .Include(e => e.salle)
            .Where(e => e.jour == dto.jour && e.hDeb < dto.hFin && e.hFin > dto.hDeb)
            .FirstOrDefaultAsync();

        if (existingEdt == null) return null;

        if (existingEdt.enseignantId == dto.enseignantId)
            return $"L'enseignant est déjà occupé par un autre cours sur ce créneau.";
    
        if (existingEdt.salleId == dto.idSalle)
            return $"La salle {existingEdt.salle?.nomSalle} est déjà réservée.";

        if (existingEdt.mentionId == dto.mentionId && existingEdt.niveauId == dto.niveauId)
            return $"Le niveau {dto.niveauId} ({dto.mentionId}) a déjà un autre cours prévu à cette heure.";

        return "Un conflit d'horaire indéterminé a été détecté.";
    }

    public async Task<EdtDto> AddAsync(CreateEdtDto dto)
    {
        var now = DateTime.Now;
        
        var conflictMessage = await GetConflictMessageAsync(dto);
        if (conflictMessage != null)
        {
            throw new EdtConflictException(conflictMessage);
        }

        var activeAnne = await _db.AnneeScolaires.Where(a => a.status == "Active").FirstOrDefaultAsync();
        if (activeAnne == null) 
            throw new(message: "Annee introuvable");
        
        var edt = new Edt
        {
            anneeId = activeAnne.idAnnee,
            hDeb = dto.hDeb,
            hFin = dto.hFin,
            jour = dto.jour,
            type = dto.type,
            disponibilite = dto.dispo,
            created_at = now,
            mentionId = dto.mentionId,
            niveauId = dto.niveauId,
            matiereId = dto.matiereId,
            enseignantId = dto.enseignantId,
            responsableId = dto.responsableId,
            salleId = dto.idSalle,
            semaine = $"{dto.semaine}"
        };
        await _db.Edts.AddAsync(edt);
        await _db.SaveChangesAsync();
        
        TimeOnly deb = TimeOnly.Parse(dto.hDeb.ToString());
        TimeOnly fin = TimeOnly.Parse(dto.hFin.ToString());
        TimeSpan diff = fin.ToTimeSpan() -  deb.ToTimeSpan();
        
        var activite = await _db.Activites
            .FirstOrDefaultAsync(a =>
                a.enseignantId == dto.enseignantId &&
                a.matiereId == dto.matiereId &&
                a.statusActivite == ""
            );
        
        if (activite != null)
        {
            activite.heureEffectue = Double.Parse(diff.TotalHours.ToString());
            activite.statusActivite = "En attente";
            activite.updated_at =  now;
            activite.created_at = now;
            await _db.SaveChangesAsync();
        }
        else
        {
            var activites = new Activite
            {
                enseignantId = dto.enseignantId,
                matiereId = dto.matiereId,
                heureEffectue = Double.Parse(diff.TotalHours.ToString()),
                statusActivite = "En attente",
                created_at = now,
            };
            await _db.Activites.AddAsync(activites);
            await _db.SaveChangesAsync();
        }
        
        return _mapper.Map<EdtDto>(edt);
    }

    public async Task<bool> UpdateStatusAsync(string id)
    {
        var res = await _db.Edts
            .Include(e => e.enseignant)
            .FirstOrDefaultAsync(e => e.numEd == id);

        if (res == null)
            return false;

        var acts = await _db.Activites.FirstOrDefaultAsync(a =>
            a.enseignantId == res.enseignantId &&
            a.created_at == res.created_at);
        
        res.disponibilite = "Terminé";
        
        if (acts != null)
        {
            acts.statusActivite = "Accompli";
            acts.updated_at = DateTime.Now;
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelAsync(string id)
    {
        var res = await _db.Edts
            .Include(e => e.enseignant)
            .FirstOrDefaultAsync(e => e.numEd == id);

        if (res == null)
            return false;

        // var dispo = await  _db.Disponibilites.Include(e => e.enseignant)
        //     .Where(a => a.enseignantId == res.enseignantId && res.hDeb >= a.hDeb && res.hFin <= a.hFin && res.jour == a.dateDispo)
        //     .ToListAsync();
        // if (dispo.Count == 0) return false;
        
        var acts = await _db.Activites.FirstOrDefaultAsync(a =>
            a.enseignantId == res.enseignantId &&
            a.created_at == res.created_at);
        
        res.disponibilite = "Annulé";
        
        if (acts != null)
        {
            acts.statusActivite = "Inaccompli";
            acts.updated_at = DateTime.Now;
        }
        await _db.SaveChangesAsync();
        return true;
    }


    public async Task<bool> UpdateAsync(string id, UpdateEdtDto dto)
    {
        var res = await _db.Edts.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var res =  await _db.Edts.FindAsync(id);
        if (res == null) return false;
        _db.Edts.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }

}