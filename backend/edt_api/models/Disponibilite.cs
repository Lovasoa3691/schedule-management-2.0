using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Disponibilite
{
    [Key] 
    [Column(TypeName = "varchar(36)")]
    public string numDispo {get; set;} = Guid.NewGuid().ToString();
    public DateOnly dateDispo{get; set;}
    public TimeOnly hDeb{get; set;}
    public TimeOnly hFin{get; set;}
    [Column(TypeName = "varchar(15)")]
    public string semaine { get; set; }
    public string enseignantId {get; set;}
    public Enseignant enseignant{get; set;}
}