using edt_api.dtos;

namespace edt_api.services;

public interface INiveau
{
    Task<IEnumerable<NiveauDto>> getAllAsync();
    Task<NiveauDto> getByIdAsync(int id);
    Task<NiveauDto> createAsync(CreateNiveauDto dto);
    Task<bool> updateAsync(int id, UpdateNiveauDto dto);
    Task<bool> deleteAsync(int id);
}