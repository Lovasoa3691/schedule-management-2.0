using AutoMapper;
using edt_api.dtos;
using edt_api.models;

namespace edt_api.profiles;

public class MentionProfile:Profile
{
    public MentionProfile()
    {
        CreateMap<Mention, MentionDto>()
            .ForCtorParam("idMent", opt => opt.MapFrom(src => src.idMent))
            .ForCtorParam("nomMention", opt => opt.MapFrom(src => src.nomMent));

        CreateMap<CreateMentionDto, Mention>()
            .ForMember(dest => dest.nomMent, opt => opt.MapFrom(src => src.nomMention));

        CreateMap<UpdateMentionDto, Mention>()
            .ForMember(dest => dest.nomMent, opt => opt.MapFrom(src => src.nomMention));

    }
}