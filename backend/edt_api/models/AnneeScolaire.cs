using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace edt_api.models;

public class AnneeScolaire
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idAnnee{get;set;}
    [Column(TypeName = "nvarchar(4)")]
    public string dateDebutAnnee { get; set; } = string.Empty;
    [Column(TypeName = "nvarchar(4)")]
    public string dateFinAnnee {get;set;} = string.Empty;
    [Column(TypeName = "nvarchar(4)")]
    public string status {get;set;}
    
    public ICollection<Edt> edts { get; set; } = new List<Edt>();
}