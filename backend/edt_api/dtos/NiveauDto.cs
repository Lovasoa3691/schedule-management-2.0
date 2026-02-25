namespace edt_api.dtos;

public record NiveauDto(int idNiv, string intitule);
public record CreateNiveauDto(string intitule);
public record UpdateNiveauDto(string intitule);