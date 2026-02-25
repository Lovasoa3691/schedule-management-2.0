using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Enseignant: Utilisateur
{
    [Column(TypeName = "varchar(50)")]
    public string grade { get; set; } = string.Empty;
    public ICollection<Disponibilite>  disponibilites { get; set; } = new List<Disponibilite>();
    public ICollection<Edt> edts { get; set; } = new List<Edt>();
    public ICollection<Message>  messages { get; set; } = new List<Message>();
    public ICollection<Activite> activites { get; set; } = new List<Activite>();
    
}