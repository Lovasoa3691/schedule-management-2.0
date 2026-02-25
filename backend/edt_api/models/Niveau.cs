using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Niveau
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idNiv { get; set; }
    [Column(TypeName = "varchar(20)")]
    public string intitule { get; set; } = string.Empty;
    
    public ICollection<Edt> edts { get; set; } = new List<Edt>();
    public ICollection<MatiereNiveau> matiereNiveau { get; set; } = new List<MatiereNiveau>();
}