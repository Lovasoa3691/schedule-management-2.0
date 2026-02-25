using edt_api.dtos;

namespace edt_api.services;

public interface IDisponibilite
{
    Task<IEnumerable<DispoDto>> GetAllAsync(string id, string week);
    Task<DispoDto> GetByIdAsync(string id);
    Task<DispoDto> CreateAsync(CreateDispoDto dto);
    Task<bool> UpdateAsync(string id, UpdateDispoDto dto);
    Task<bool> DeleteAsync(string id);
}