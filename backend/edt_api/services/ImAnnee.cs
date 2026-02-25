using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using Microsoft.EntityFrameworkCore;

namespace edt_api.services;

public class ImAnnee : IAnnee
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ImAnnee(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    public async Task<IEnumerable<AnneeDto>> GetAllAsync()
    {
        var mention = await _db.AnneeScolaires.ToListAsync();
        return _mapper.Map<IEnumerable<AnneeDto>>(mention);
    }

    public async Task<AnneeDto?> GetByIdAsync(int id)
    {
        var res = await _db.AnneeScolaires.FindAsync(id);
        return res == null ? null : _mapper.Map<AnneeDto>(res);
    }

    public async Task<AnneeDto> AddAsync(CreateAnneeDto dto)
    {
        var data = new AnneeScolaire
        {
            dateDebutAnnee = dto.debut,
            dateFinAnnee = dto.fin,
            status = dto.status,
        };
        
        _db.AnneeScolaires.Add(data);
        await _db.SaveChangesAsync();
        return _mapper.Map<AnneeDto>(data);
    }

    public async Task<bool> UpdateAsync(int id, UpdateAnneeDto dto)
    {
        var res =  await _db.AnneeScolaires.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        _db.AnneeScolaires.Update(res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var res =  await _db.AnneeScolaires.FindAsync(id);
        if (res == null) return false;
        _db.AnneeScolaires.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
}