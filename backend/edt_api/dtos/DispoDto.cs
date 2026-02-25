namespace edt_api.dtos;

public record DispoDto(string idDispo, DateOnly dateDispo, TimeOnly hDeb, TimeOnly hFin, string nomEns, string prenomEns, string grade);
public record CreateDispoDto(DateOnly dateDispo, TimeOnly hDeb, TimeOnly hFin, string codeEns, string semaine);
public record UpdateDispoDto(DateOnly dateDispo, TimeOnly hDeb, TimeOnly hFin, string codeEns, string semaine);