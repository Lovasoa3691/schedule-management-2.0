using edt_api.dtos;

namespace edt_api.services;

public interface IEdt
{
    Task<IEnumerable<EdtDto>> GetAllAsync(string id, DateOnly? startDate = null, DateOnly? endDate = null);
    Task<EdtDto> GetByIdAsync(string id);
    Task<EdtDto> AddAsync(CreateEdtDto dto);
    Task<bool> UpdateAsync(string id, UpdateEdtDto dto);
    Task<bool> DeleteAsync(string id);

    Task<bool> CheckConflitAsync(CreateEdtDto dto);
}