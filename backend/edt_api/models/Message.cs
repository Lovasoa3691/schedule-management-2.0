using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Message
{
    [Key]
    [Column(TypeName = "varchar(36)")]
    public string idMes {get;set;} = new Guid().ToString();
    public DateTime dateMes {get;set;}
    public string texte {get;set;}
    [Column(TypeName = "varchar(20)")]
    public string statusMes {get;set;}
    
    public string enseignantId { get; set; }
    public Enseignant enseignant {get;set;}
    
    public string responsableId { get; set; }
    public Responsable responsable {get;set;}
}