namespace edt_api.dtos;

public record EnseignantDto(string id, string nom, string prenom, string phone, string grade, string genre, string adresse, string email);
public record MatiereInfoDto(string matiere, int hPrevue, double hEffectue);
public record EnseignantInfoDto(string nom, string prenom, string grade, string email, List<MatiereInfoDto> matiereInfo);
public record CreateEnseignantDto(string nom, string prenom, string phone, string grade, string genre, string adresse);
public record UpdateEnseignantDto(string nom, string prenom, string phone, string grade, string genre, string adresse);
public record RegisterEnseignantDto(string nom, string prenom, string phone, string email, string mdp);