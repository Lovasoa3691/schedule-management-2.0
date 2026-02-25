using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class AnneeProfile:Profile
{
    public AnneeProfile()
    {
        CreateMap<AnneeScolaire, AnneeDto>()
            .ForCtorParam("idAnnee", opt => opt.MapFrom(src => src.idAnnee))
            .ForCtorParam("debut", opt => opt.MapFrom(src => src.dateDebutAnnee))
            .ForCtorParam("fin", opt => opt.MapFrom(src => src.dateFinAnnee))
            .ForCtorParam("status", opt => opt.MapFrom(src => src.status));

        
        CreateMap<CreateAnneeDto, AnneeScolaire>()
            .ForMember(dest => dest.dateDebutAnnee, opt => opt.MapFrom(src => src.debut))
            .ForMember(dest => dest.dateFinAnnee, opt => opt.MapFrom(src => src.fin))
            .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.status));

        CreateMap<UpdateAnneeDto, AnneeScolaire>()
            .ForMember(dest => dest.dateDebutAnnee, opt => opt.MapFrom(src => src.debut))
            .ForMember(dest => dest.dateFinAnnee, opt => opt.MapFrom(src => src.fin))
            .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.status));

    }
}