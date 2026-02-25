namespace edt_api.dtos;

public record MentionDto(int idMent, string nomMention);
public record CreateMentionDto(string nomMention);
public record UpdateMentionDto(string nomMention);