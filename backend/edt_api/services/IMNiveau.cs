using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using Microsoft.EntityFrameworkCore;

namespace edt_api.services;

public class IMNiveau: INiveau
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public IMNiveau(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<NiveauDto>> getAllAsync()
    {
        var niveaus = await _db.Niveaux.ToListAsync();
        return _mapper.Map<IEnumerable<NiveauDto>>(niveaus);
    }

    public async Task<NiveauDto?> getByIdAsync(int id)
    {
        var res = await _db.Niveaux.FindAsync(id);
        return res == null ? null : _mapper.Map<NiveauDto>(res);
    }

    public async Task<NiveauDto> createAsync(CreateNiveauDto dto)
    {
        var niv = new Niveau
        {
            intitule= dto.intitule
        };
        
        _db.Niveaux.Add(niv);
        await _db.SaveChangesAsync();
        return _mapper.Map<NiveauDto>(niv);
    }

    public async Task<bool> updateAsync(int id, UpdateNiveauDto dto)
    {
        var res = await _db.Niveaux.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> deleteAsync(int id)
    {
        var res = await _db.Niveaux.FindAsync(id);
        if (res == null) return false;
        
        _db.Niveaux.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
}