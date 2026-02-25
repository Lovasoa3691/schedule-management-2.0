using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Mention
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idMent { get; set; }
    [Column(TypeName = "varchar(20)")]
    public string nomMent { get; set; } = string.Empty;
    
    public ICollection<Edt> edts { get; set; } = new List<Edt>();
    public ICollection<MatiereMention>  matiereMention { get; set; } = new List<MatiereMention>();
}