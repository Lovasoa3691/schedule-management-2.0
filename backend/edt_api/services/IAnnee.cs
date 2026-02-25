using edt_api.dtos;

namespace edt_api.services;

public interface IAnnee
{
    Task<IEnumerable<AnneeDto>> GetAllAsync();
    Task<AnneeDto> GetByIdAsync(int id);
    Task<AnneeDto> AddAsync(CreateAnneeDto dto);
    Task<bool> UpdateAsync(int id, UpdateAnneeDto dto);
    Task<bool> DeleteAsync(int id);
    
}