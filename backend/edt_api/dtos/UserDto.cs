namespace edt_api.dtos;

public record UserDto(string id, string nom, string prenom, string phone, string role, string email, string genre, string adresse, string creation, string? photo, string status);