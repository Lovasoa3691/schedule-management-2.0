using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class UserProfile:Profile
{
    public UserProfile()
    {
        CreateMap<Utilisateur, UserDto>()
            .ForCtorParam("id", opt => opt.MapFrom(src => src.idUt))
            .ForCtorParam("nom", opt => opt.MapFrom(src => src.nom))
            .ForCtorParam("prenom", opt => opt.MapFrom(src => src.prenom))
            .ForCtorParam("phone", opt => opt.MapFrom(src => src.telephone))
            .ForCtorParam("role", opt => opt.MapFrom(src => src.role))
            .ForCtorParam("genre", opt => opt.MapFrom(src => src.genre))
            .ForCtorParam("adresse", opt => opt.MapFrom(src => src.adresse))
            .ForCtorParam("email", opt => opt.MapFrom(src => src.Authentifications.FirstOrDefault()!.email));
    }
}