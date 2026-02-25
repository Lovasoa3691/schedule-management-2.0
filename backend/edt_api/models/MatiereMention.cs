namespace edt_api.models;

public class MatiereMention
{
    public string matiereId { get; set; }
    public Matiere matiere { get; set; }
    
    public int mentionId { get; set; }
    public Mention mention { get; set; }
}