namespace edt_api.models;

public class MatiereNiveau
{
    public string matiereId { get; set; }
    public Matiere matiere { get; set; }
    
    public int niveauId { get; set; }
    public Niveau niveau { get; set; }
}