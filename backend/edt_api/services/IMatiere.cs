using edt_api.dtos;

namespace edt_api.services;

public interface IMatiere
{
    Task<IEnumerable<MatiereDto>> GetAllAsync();
    Task<MatiereDto> GetByIdAsync(string id);
    Task<MatiereDto> AddAsync(CreateMatiereDto dto);
    Task<bool> UpdateAsync(string id, UpdateMatiereDto dto);
    Task<bool> DeleteAsync(string id);
}