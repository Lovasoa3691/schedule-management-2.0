namespace edt_api.dtos;

public record MatiereDto(string id, string nomMat, int nbH, int coeff, List<string> enseignants, List<string> mention, List<string> niveau, List<int> mentionId, List<int> niveauId);
public record CreateMatiereDto( string nomMat, int nbH, int coeff, List<int> mentionId, List<int> niveauId, string enseignantId);
public record UpdateMatiereDto(string nomMat, int nbH, int coeff, List<int> mentionId, List<int> niveauId);