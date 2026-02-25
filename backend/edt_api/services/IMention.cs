using edt_api.dtos;

namespace edt_api.services;

public interface IMention
{
    Task<IEnumerable<MentionDto>> getAllAsync();
    Task<MentionDto> getByIdAsync(int id);
    Task<MentionDto> addAsync(CreateMentionDto dto);
    Task<bool> updateAsync(int id, UpdateMentionDto dto);
    Task<bool> deleteAsync(int id);
    
}