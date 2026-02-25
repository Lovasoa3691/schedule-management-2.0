using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class SalleProfile:Profile
{
    public SalleProfile()
    {
        CreateMap<Salle, SalleDto>()
            .ForCtorParam("idsalle", opt => opt.MapFrom(src => src.idSalle))
            .ForCtorParam("nomsalle", opt => opt.MapFrom(src => src.nomSalle))
            .ForCtorParam("capacite", opt => opt.MapFrom(src => src.capacite))
            .ForCtorParam("typesalle", opt => opt.MapFrom(src => src.typeSalle))
            .ForCtorParam("localisation", opt => opt.MapFrom(src => src.localisation));

        CreateMap<CreateSalleDto, Salle>()
            .ForMember(dest => dest.nomSalle, opt => opt.MapFrom(src => src.nomsalle))
            .ForMember(dest => dest.capacite, opt => opt.MapFrom(src => src.capacite))
            .ForMember(dest => dest.typeSalle, opt => opt.MapFrom(src => src.typesalle))
            .ForMember(dest => dest.localisation, opt => opt.MapFrom(src => src.localisation));

        CreateMap<UpdateSalleDto, Salle>()
            .ForMember(dest => dest.nomSalle, opt => opt.MapFrom(src => src.nomsalle))
            .ForMember(dest => dest.capacite, opt => opt.MapFrom(src => src.capacite))
            .ForMember(dest => dest.typeSalle, opt => opt.MapFrom(src => src.typesalle))
            .ForMember(dest => dest.localisation, opt => opt.MapFrom(src => src.localisation));
    }
}