using edt_api.dtos;

namespace edt_api.services;

public interface ISalle
{
    Task<IEnumerable<SalleDto>> getAllAsync();
    Task<SalleDto> getByIdAsync(int id);
    Task<SalleDto> createAsync(CreateSalleDto dto);
    Task<bool> updateAsync(int id, UpdateSalleDto dto);
    Task<bool> deleteAsync(int id);
}