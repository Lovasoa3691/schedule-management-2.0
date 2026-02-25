using AutoMapper;
using edt_api.config;
using edt_api.dtos;
using edt_api.models;
using Microsoft.EntityFrameworkCore;

namespace edt_api.services;

public class ImMention : IMention
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public ImMention(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }
    public async Task<IEnumerable<MentionDto>> getAllAsync()
    {
        var mention = await _db.Mentions.ToListAsync();
        return _mapper.Map<IEnumerable<MentionDto>>(mention);
    }

    public async Task<MentionDto?> getByIdAsync(int id)
    {
        var res = await _db.Mentions.FindAsync(id);
        return res == null ? null : _mapper.Map<MentionDto>(res);
    }

    public async Task<MentionDto> addAsync(CreateMentionDto dto)
    {
        var data = new Mention
        {
            nomMent = dto.nomMention
        };
        
        _db.Mentions.Add(data);
        await _db.SaveChangesAsync();
        return _mapper.Map<MentionDto>(data);
    }

    public async Task<bool> updateAsync(int id, UpdateMentionDto dto)
    {
        var res =  await _db.Mentions.FindAsync(id);
        if (res == null) return false;
        
        _mapper.Map(dto, res);
        _db.Mentions.Update(res);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> deleteAsync(int id)
    {
        var res =  await _db.Mentions.FindAsync(id);
        if (res == null) return false;
        _db.Mentions.Remove(res);
        await _db.SaveChangesAsync();
        return true;
    }
}