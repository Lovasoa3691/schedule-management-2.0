using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class NiveauProfile:Profile
{
    public NiveauProfile()
    {
        CreateMap<Niveau, NiveauDto>()
            .ForCtorParam("idNiv", opt => opt.MapFrom(src => src.idNiv))
            .ForCtorParam("intitule", opt => opt.MapFrom(src => src.intitule));

        CreateMap<CreateNiveauDto, Niveau>()
            .ForMember(dest => dest.intitule, opt => opt.MapFrom(src => src.intitule));

        CreateMap<UpdateNiveauDto, Niveau>()
            .ForMember(dest => dest.intitule, opt => opt.MapFrom(src => src.intitule));

    }
}