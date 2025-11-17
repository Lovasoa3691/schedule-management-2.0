using System.ComponentModel.DataAnnotations;

namespace edt_api.models;

public abstract class Utilisateur
{
    [Key]
    public string idUt{get;set;} = Guid.NewGuid().ToString();
    public string nom{get;set;} = string.Empty;
    public string prenom{get;set;} = string.Empty;
    public string telephone{get;set;} = string.Empty;
    public string genre{get;set;} = string.Empty;
    public string adresse{get;set;} = string.Empty;
    
    public ICollection<Authentification> Authentifications{get;set;} = new List<Authentification>();
}