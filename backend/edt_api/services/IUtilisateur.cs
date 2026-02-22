using edt_api.dtos;
using edt_api.models;

namespace edt_api.services;

public interface IUtilisateur
{
    Task<IEnumerable<ResponsableDto>> getAllAsync();
    Task<IEnumerable<EnseignantDto>> getAllTeacherAsync();
    Task<IEnumerable<EnseignantActiviteDto>> getSpecificTeacher();
    Task<IEnumerable<EnseignantInfoDto>> getInfoTeacherAsync(string id);
    Utilisateur? GetUtilisateurById(string id);
    Task<IEnumerable<UserDto>> getByIdAsync(string id, string role);
    Task<AuthDto> getUserConnected(LoginDto dto);
    Task<ResponsableDto> createAsync(CreateResponsableDto dto);
    Task<EnseignantDto> addAsync(CreateEnseignantDto dto);
    Task<EnseignantDto> registerAsync(RegisterEnseignantDto dto);
    Task<bool> updateAsync(string id, UpdateResponsableDto dto);
    Task<bool> updateTeacherAsync(string id, UpdateEnseignantDto dto);
    Task<bool> deleteAsync(string id);
    Task<bool> deleteTeacherAsync(string id);
}