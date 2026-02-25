using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class EnseignantProfile:Profile
{
    public EnseignantProfile()
    {
        CreateMap<Enseignant, EnseignantDto>()
            .ForCtorParam("id", opt => opt.MapFrom(src => src.idUt))
            .ForCtorParam("nom", opt => opt.MapFrom(src => src.nom))
            .ForCtorParam("prenom", opt => opt.MapFrom(src => src.prenom))
            .ForCtorParam("phone", opt => opt.MapFrom(src => src.telephone))
            .ForCtorParam("grade", opt => opt.MapFrom(src => src.grade))
            .ForCtorParam("adresse", opt => opt.MapFrom(src => src.adresse))
            .ForCtorParam("email", opt => opt.MapFrom(src => src.Authentifications.FirstOrDefault()!.email));

        CreateMap<Activite, EnseignantActiviteDto>()
            .ForCtorParam("idAct", opt => opt.MapFrom(src => src.idActivite))
            .ForCtorParam("codeMat", opt => opt.MapFrom(src => src.matiere.codeMat))
            .ForCtorParam("idEns", opt => opt.MapFrom(src => src.enseignant.idUt))
            .ForCtorParam("nom", opt => opt.MapFrom(src => src.enseignant.nom))
            .ForCtorParam("prenom", opt => opt.MapFrom(src => src.enseignant.prenom));
        
        CreateMap<CreateEnseignantDto, Enseignant>()
            .ForMember(dest => dest.nom, opt => opt.MapFrom(src => src.nom))
            .ForMember(dest => dest.prenom, opt => opt.MapFrom(src => src.prenom))
            .ForMember(dest => dest.telephone, opt => opt.MapFrom(src => src.phone))
            .ForMember(dest => dest.grade, opt => opt.MapFrom(src => src.grade))
            .ForMember(dest => dest.genre, opt => opt.MapFrom(src => src.genre))
            .ForMember(dest => dest.adresse, opt => opt.MapFrom(src => src.adresse));

        CreateMap<UpdateEnseignantDto, Enseignant>()
            .ForMember(dest => dest.nom, opt => opt.MapFrom(src => src.nom))
            .ForMember(dest => dest.prenom, opt => opt.MapFrom(src => src.prenom))
            .ForMember(dest => dest.telephone, opt => opt.MapFrom(src => src.phone))
            .ForMember(dest => dest.grade, opt => opt.MapFrom(src => src.grade))
            .ForMember(dest => dest.genre, opt => opt.MapFrom(src => src.genre))
            .ForMember(dest => dest.adresse, opt => opt.MapFrom(src => src.adresse));
        
    }
}