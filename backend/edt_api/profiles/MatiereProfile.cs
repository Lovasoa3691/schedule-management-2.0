using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class MatiereProfile:Profile
{
    public MatiereProfile()
    {
        CreateMap<Matiere, MatiereDto>()
            .ForCtorParam("id", opt => opt.MapFrom(src => src.codeMat))
            .ForCtorParam("nomMat", opt => opt.MapFrom(src => src.nomMat))
            .ForCtorParam("nbH", opt => opt.MapFrom(src => src.nbHor))
            .ForCtorParam("coeff", opt => opt.MapFrom(src => src.coefficient))
            .ForCtorParam(
                "enseignants",
                opt => opt.MapFrom(src =>
                    src.activites
                        .Select(e => $"{e.enseignant.nom} {e.enseignant.prenom}")
                        .ToList()
                )
            )
            .ForCtorParam("mentionId", opt => opt.MapFrom(src =>
                src.matiereMention != null
                    ? src.matiereMention
                        .Where(m => m.mention != null)
                        .Select(m => m.mention.idMent)
                        .ToList()
                    : new List<int>()))
            .ForCtorParam("niveauId", opt => opt.MapFrom(src =>
                src.matiereNiveau != null
                    ? src.matiereNiveau
                        .Where(n => n.niveau != null)
                        .Select(n => n.niveau.idNiv)
                        .ToList()
                    : new List<int>()))
            .ForCtorParam("mention", opt => opt.MapFrom(src =>
                src.matiereMention != null
                    ? src.matiereMention
                        .Where(m => m.mention != null)
                        .Select(m => m.mention.nomMent)
                        .ToList()
                    : new List<string>()))
            .ForCtorParam("niveau", opt => opt.MapFrom(src =>
                src.matiereNiveau != null
                    ? src.matiereNiveau
                        .Where(n => n.niveau != null)
                        .Select(n => n.niveau.intitule)
                        .ToList()
                    : new List<string>()));
            
            // .ForCtorParam("mentionId", opt => opt.MapFrom(src => src.matiereMention.Select(n => n.mention.idMent).ToList()))
            // .ForCtorParam("niveauId", opt => opt.MapFrom(src => src.matiereNiveau.Select(n => n.niveau.idNiv).ToList()))
            // .ForCtorParam("mention", opt => opt.MapFrom(src => src.matiereMention.Select(n => n.mention.nomMent).ToList()))
            // .ForCtorParam("niveau", opt => opt.MapFrom(src => src.matiereNiveau.Select(n => n.niveau.intitule).ToList()));
            

        CreateMap<CreateMatiereDto, Matiere>()
            .ForMember(dest => dest.nomMat, opt => opt.MapFrom(src => src.nomMat))
            .ForMember(dest => dest.nbHor, opt => opt.MapFrom(src => src.nbH))
            .ForMember(dest => dest.coefficient, opt => opt.MapFrom(src => src.coeff))
            .ForMember(dest => dest.matiereMention, opt => opt.Ignore())
            .ForMember(dest => dest.matiereNiveau, opt => opt.Ignore());

        CreateMap<UpdateMatiereDto, Matiere>()
            .ForMember(dest => dest.nomMat, opt => opt.MapFrom(src => src.nomMat))
            .ForMember(dest => dest.nbHor, opt => opt.MapFrom(src => src.nbH))
            .ForMember(dest => dest.coefficient, opt => opt.MapFrom(src => src.coeff))
            .ForMember(dest => dest.matiereMention, opt => opt.Ignore())
            .ForMember(dest => dest.matiereNiveau, opt => opt.Ignore());

    }
}