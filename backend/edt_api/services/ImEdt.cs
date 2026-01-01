using System.Runtime.InteropServices;
using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
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
            .ThenInclude(ee => ee.enseignements)
            .Include(a => a.matiere)
            .Include(m => m.mention)
            .Include(n => n.niveau)
            .Include(s => s.salle)
            .Include(a => a.anneeScolaire);

        if (id != "all")
        {
            if (startDate.HasValue && endDate.HasValue)
            {
                query = query.Where(e => e.enseignantId == id && e.jour >= startDate.Value && e.jour <= endDate.Value);
            }
            else
            {
                query = query.Where(e => e.enseignantId == id);
            }
        }

        if (startDate.HasValue && endDate.HasValue)
        {
            query = query.Where(e => e.jour >= startDate.Value && e.jour <= endDate.Value);
        }

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
            .Where(e =>
                (e.hDeb < dto.hFin && e.hFin > dto.hDeb)
                &&
                (
                    
                    e.enseignantId == dto.enseignantId ||
                   
                    e.salleId == dto.idSalle
                    
                )
            )
            .FirstOrDefaultAsync();

        return conflit != null;
    }

    public async Task<EdtDto> AddAsync(CreateEdtDto dto)
    {
        
        var conflict = await CheckConflitAsync(dto);
        if (conflict)
        {
            throw new InvalidOperationException("Chevuachement detecte: la salle ou l'enseignant est déjà occupé.");
        }
        
        var data = _mapper.Map<Edt>(dto);
        await _db.Edts.AddAsync(data);
        await _db.SaveChangesAsync();
        
        TimeOnly deb = TimeOnly.Parse(dto.hDeb.ToString());
        TimeOnly fin = TimeOnly.Parse(dto.hFin.ToString());
        
        TimeSpan diff = fin.ToTimeSpan() -  deb.ToTimeSpan();

        var enseignement = new Enseignement
        {
            enseignantId = dto.enseignantId,
            matiereId = dto.matiereId,
            heureEffectue = Double.Parse(diff.TotalHours.ToString()),
            ststusEnseignement = "En cours"
        };
        
        await _db.Enseignements.AddAsync(enseignement);
        await _db.SaveChangesAsync();
        
        return _mapper.Map<EdtDto>(data);
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