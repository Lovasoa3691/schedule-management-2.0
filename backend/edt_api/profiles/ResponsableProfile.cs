using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class ResponsableProfile:Profile
{
    public ResponsableProfile()
    {
        CreateMap<Responsable, ResponsableDto>()
            .ForCtorParam("id", opt => opt.MapFrom(src => src.idUt))
            .ForCtorParam("nom", opt => opt.MapFrom(src => src.nom))
            .ForCtorParam("prenom", opt => opt.MapFrom(src => src.prenom))
            .ForCtorParam("phone", opt => opt.MapFrom(src => src.telephone))
            .ForCtorParam("fonction", opt => opt.MapFrom(src => src.role))
            .ForCtorParam("genre", opt => opt.MapFrom(src => src.genre))
            .ForCtorParam("adresse", opt => opt.MapFrom(src => src.adresse))
            .ForCtorParam("email", opt => opt.MapFrom(src => src.Authentifications.FirstOrDefault()!.email));

        CreateMap<CreateResponsableDto, Responsable>()
            .ForMember(dest => dest.nom, opt => opt.MapFrom(src => src.nom))
            .ForMember(dest => dest.prenom, opt => opt.MapFrom(src => src.prenom))
            .ForMember(dest => dest.telephone, opt => opt.MapFrom(src => src.phone))
            .ForMember(dest => dest.role, opt => opt.MapFrom(src => src.fonction))
            .ForMember(dest => dest.genre, opt => opt.MapFrom(src => src.genre))
            .ForMember(dest => dest.adresse, opt => opt.MapFrom(src => src.adresse));

        CreateMap<UpdateResponsableDto, Responsable>()
            .ForMember(dest => dest.nom, opt => opt.MapFrom(src => src.nom))
            .ForMember(dest => dest.prenom, opt => opt.MapFrom(src => src.prenom))
            .ForMember(dest => dest.telephone, opt => opt.MapFrom(src => src.phone))
            .ForMember(dest => dest.role, opt => opt.MapFrom(src => src.fonction))
            .ForMember(dest => dest.genre, opt => opt.MapFrom(src => src.genre))
            .ForMember(dest => dest.adresse, opt => opt.MapFrom(src => src.adresse));
    }
}