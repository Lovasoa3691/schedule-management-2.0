namespace edt_api.dtos;

public record AuthDto(string email, string role, string token);
public record LoginDto(string email, string mdp, string role);
public record RegisterDto(string nom, string prenom, string phone, string email, string mdp);