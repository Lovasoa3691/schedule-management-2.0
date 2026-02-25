using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class DispoProfile:Profile
{
    public DispoProfile()
    {
        CreateMap<Disponibilite, DispoDto>()
            .ForCtorParam("idDispo", opt => opt.MapFrom(src => src.numDispo))
            .ForCtorParam("dateDispo", opt => opt.MapFrom(src => src.dateDispo))
            .ForCtorParam("hDeb", opt => opt.MapFrom(src => src.hDeb))
            .ForCtorParam("hFin", opt => opt.MapFrom(src => src.hFin))
            .ForCtorParam("nomEns", opt => opt.MapFrom(src => src.enseignant.nom))
            .ForCtorParam("prenomEns", opt => opt.MapFrom(src => src.enseignant.prenom))
            .ForCtorParam("grade", opt => opt.MapFrom(src => src.enseignant.grade));


        CreateMap<CreateDispoDto, Disponibilite>()
            .ForMember(dest => dest.dateDispo, opt => opt.MapFrom(src => src.dateDispo))
            .ForMember(dest => dest.hDeb, opt => opt.MapFrom(src => src.hDeb))
            .ForMember(dest => dest.hFin, opt => opt.MapFrom(src => src.hFin))
            .ForMember(dest => dest.enseignantId, opt => opt.MapFrom(src => src.codeEns));

        CreateMap<UpdateDispoDto, Disponibilite>()
            .ForMember(dest => dest.dateDispo, opt => opt.MapFrom(src => src.dateDispo))
            .ForMember(dest => dest.hDeb, opt => opt.MapFrom(src => src.hDeb))
            .ForMember(dest => dest.hFin, opt => opt.MapFrom(src => src.hFin))
            .ForMember(dest => dest.enseignantId, opt => opt.MapFrom(src => src.codeEns));

    }
}