using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class EdtProfile:Profile
{
    public EdtProfile()
    {
        CreateMap<Edt, EdtDto>()
            .ForCtorParam("numEd", opt => opt.MapFrom(src => src.numEd))
            .ForCtorParam("jour", opt => opt.MapFrom(src => src.jour))
            .ForCtorParam("hDeb", opt => opt.MapFrom(src => src.hDeb))
            .ForCtorParam("hFin", opt => opt.MapFrom(src => src.hFin))
            .ForCtorParam("dispo", opt => opt.MapFrom(src => src.disponibilite))
            .ForCtorParam("type", opt => opt.MapFrom(src => src.type))
            .ForCtorParam("nomSalle", opt => opt.MapFrom(src => src.salle.nomSalle))
            .ForCtorParam("mention", opt => opt.MapFrom(src => src.mention.nomMent))
            .ForCtorParam("niveau", opt => opt.MapFrom(src => src.niveau.intitule))
            .ForCtorParam("nomEns", opt => opt.MapFrom(src => src.enseignant.nom))
            .ForCtorParam("prenomEns", opt => opt.MapFrom(src => src.enseignant.prenom))
            .ForCtorParam("nomMatiere", opt => opt.MapFrom(src => src.matiere.nomMat))
            .ForCtorParam("idEns", opt => opt.MapFrom(src => src.enseignant.activites.FirstOrDefault()!.idActivite))
            .ForCtorParam("status", opt => opt.MapFrom(src => src.enseignant.activites.FirstOrDefault()!.statusActivite));

        CreateMap<CreateEdtDto, Edt>()
            .ForMember(dest => dest.jour, opt => opt.MapFrom(src => src.jour))
            .ForMember(dest => dest.hDeb, opt => opt.MapFrom(src => src.hDeb))
            .ForMember(dest => dest.hFin, opt => opt.MapFrom(src => src.hFin))
            .ForMember(dest => dest.disponibilite, opt => opt.MapFrom(src => src.dispo))
            .ForMember(dest => dest.type, opt => opt.MapFrom(src => src.type))
            .ForMember(dest => dest.responsableId, opt => opt.MapFrom(src => src.responsableId))
            .ForMember(dest => dest.salleId, opt => opt.MapFrom(src => src.idSalle))
            .ForMember(dest => dest.enseignantId, opt => opt.MapFrom(src => src.enseignantId))
            .ForMember(dest => dest.mentionId, opt => opt.MapFrom(src => src.mentionId))
            .ForMember(dest => dest.niveauId, opt => opt.MapFrom(src => src.niveauId))
            .ForMember(dest => dest.matiereId, opt => opt.MapFrom(src => src.matiereId))
            .ForMember(dest => dest.semaine, opt => opt.MapFrom(src => src.semaine))
            .ForMember(dest => dest.anneeId, opt => opt.MapFrom(src => src.anneeId));

            CreateMap<UpdateEdtDto, Edt>()
                .ForMember(dest => dest.jour, opt => opt.MapFrom(src => src.jour))
                .ForMember(dest => dest.hDeb, opt => opt.MapFrom(src => src.hDeb))
                .ForMember(dest => dest.hFin, opt => opt.MapFrom(src => src.hFin))
                .ForMember(dest => dest.disponibilite, opt => opt.MapFrom(src => src.dispo))
                .ForMember(dest => dest.type, opt => opt.MapFrom(src => src.type))
                .ForMember(dest => dest.responsableId, opt => opt.MapFrom(src => src.responsableId))
                .ForMember(dest => dest.salleId, opt => opt.MapFrom(src => src.idSalle))
                .ForMember(dest => dest.enseignantId, opt => opt.MapFrom(src => src.enseignantId))
                .ForMember(dest => dest.mentionId, opt => opt.MapFrom(src => src.mentionId))
                .ForMember(dest => dest.niveauId, opt => opt.MapFrom(src => src.niveauId))
                // .ForMember(dest => dest.semaine, opt => opt.MapFrom(src => src.semaine))
                .ForMember(dest => dest.matiereId, opt => opt.MapFrom(src => src.matiereId));
    }
}