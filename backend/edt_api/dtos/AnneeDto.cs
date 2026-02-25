namespace edt_api.dtos;

public record AnneeDto(int idAnnee, string debut, string fin, string status);
public record CreateAnneeDto(string debut, string fin, string status);
public record UpdateAnneeDto(string debut, string fin, string status);