using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Activite
{
    [Key]
    [Column(TypeName = "varchar(36)")]
    public string idActivite { get; set; } = Guid.NewGuid().ToString();
    public double heureEffectue { get; set; }
    [Column(TypeName = "varchar(15)")]
    public string statusActivite { get; set; } = String.Empty;
    public DateTime created_at { get; set; }
    public DateTime updated_at { get; set; }
    
    public string matiereId { get; set; }
    public Matiere matiere { get; set; }
    
    public string enseignantId { get; set; }
    public Enseignant enseignant {get;set;}
}