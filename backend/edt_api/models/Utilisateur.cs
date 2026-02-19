using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public abstract class Utilisateur
{
    [Key]
    [Column(TypeName = "varchar(36)")]
    public string idUt{get;set;} = Guid.NewGuid().ToString();
    [Column(TypeName = "varchar(50)")]
    public string nom{get;set;} = string.Empty;
    [Column(TypeName = "varchar(50)")]
    public string prenom{get;set;} = string.Empty;
    [Column(TypeName = "varchar(15)")]
    public string telephone{get;set;} = string.Empty;
    [Column(TypeName = "varchar(15)")]
    public string genre{get;set;} = string.Empty;
    [Column(TypeName = "varchar(20)")]
    public string adresse{get;set;} = string.Empty;
    
    public ICollection<Authentification> Authentifications{get;set;} = new List<Authentification>();
}