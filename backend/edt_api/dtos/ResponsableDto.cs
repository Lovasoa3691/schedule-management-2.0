namespace edt_api.dtos;

public record ResponsableDto(string id, string nom, string prenom, string phone, string fonction, string email, string genre, string adresse);
public record CreateResponsableDto(string nom, string prenom, string phone, string fonction, string email, string genre, string adresse, string mdp);
public record UpdateResponsableDto(string nom, string prenom, string phone, string fonction, string email, string genre, string adresse);