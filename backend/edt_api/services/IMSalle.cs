using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using Microsoft.EntityFrameworkCore;

namespace edt_api.services;

public class IMSalle:ISalle
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public IMSalle(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    
    public async Task<IEnumerable<SalleDto>> getAllAsync()
    {
        var salle = await _db.Salles.ToListAsync();
        return _mapper.Map<IEnumerable<SalleDto>>(salle);
    }

    public async Task<SalleDto?> getByIdAsync(int id)
    {
        var res = await _db.Salles.FindAsync(id);
        return res == null ? null : _mapper.Map<SalleDto>(res);
    }

    public async Task<SalleDto> createAsync(CreateSalleDto dto)
    {
        var res = _mapper.Map<Salle>(dto);
        await _db.Salles.AddAsync(res);
        await _db.SaveChangesAsync();
        return _mapper.Map<SalleDto>(res);
    }

    public async Task<bool> updateAsync(int id, UpdateSalleDto dto)
    {
        var res = await _db.Salles.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> deleteAsync(int id)
    {
        var res = await _db.Salles.FindAsync(id);
        if (res == null) return false;
        
        _db.Salles.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
}