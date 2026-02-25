using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Authentification
{
    [Key]
    [Column(TypeName = "varchar(36)")]
    public string idAuth{get;set;} = Guid.NewGuid().ToString();
    public string email{get;set;} = string.Empty;
    public string mdp{get;set;} = string.Empty;
    public bool isActive{get;set;} = false;

    public string utilisateurId { get; set; } = null!;
    public Utilisateur utilisateur{get;set;}
}