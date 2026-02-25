using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using edt_api.dtos;

namespace edt_api.models;

public class Matiere
{
    [Key] 
    [Column(TypeName = "varchar(36)")]
    public string codeMat { get; set; } = Guid.NewGuid().ToString();
    [Column(TypeName = "varchar(20)")]
    public string nomMat { get; set; } = string.Empty;
    public int nbHor { get; set; }
    public int coefficient{ get; set; }
    public ICollection<Edt> edts { get; set; } = new List<Edt>();
    public ICollection<Activite> activites { get; set; } = new List<Activite>();
    public ICollection<MatiereMention> matiereMention { get; set; } = new List<MatiereMention>();
    public ICollection<MatiereNiveau>  matiereNiveau { get; set; } = new List<MatiereNiveau>();
}