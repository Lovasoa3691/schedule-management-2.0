using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Enseignement
{
    public int numero { get; set; }
    public double heureEffectue { get; set; }
    public string ststusEnseignement { get; set; }
    
    public string matiereId { get; set; }
    public Matiere matiere { get; set; }
    
    public string enseignantId { get; set; }
    public Enseignant enseignant {get;set;}
}