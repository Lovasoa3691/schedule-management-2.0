namespace edt_api.dtos;

public record SalleDto(int idsalle, string nomsalle, int capacite, string typesalle, string localisation);
public record CreateSalleDto(string nomsalle, int capacite, string typesalle, string localisation);
public record UpdateSalleDto(string nomsalle, int capacite, string typesalle, string localisation);