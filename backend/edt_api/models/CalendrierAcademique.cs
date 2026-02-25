using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class CalendrierAcademique
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int idCal{get;set;}
    public DateOnly dateDebut{get;set;}
    public DateOnly dateFin{get;set;}
    public string typeCal{get;set;}
    public string descriptionCal{get;set;}
    
}