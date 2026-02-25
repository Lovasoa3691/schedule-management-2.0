using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Authentification
{
    [Key]
    [Column(TypeName = "varchar(36)")]
    public string idAuth{get;set;} = Guid.NewGuid().ToString();
    [Column(TypeName = "varchar(50)")]
    public string email{get;set;} = string.Empty;
    [Column(TypeName = "varchar(255)")]
    public string mdp{get;set;} = string.Empty;
    public bool isActive{get;set;} = false;
    public DateTime createdAt { get; set;}
    [Column(TypeName = "varchar(36)")]
    public string? status {get; set;} = string.Empty;
    [Column(TypeName = "varchar(100)")]
    public string? photo {get; set;} = string.Empty;

    public string utilisateurId { get; set; } = null!;
    public Utilisateur utilisateur{get;set;}
}