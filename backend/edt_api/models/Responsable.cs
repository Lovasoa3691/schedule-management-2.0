using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace edt_api.models;

public class Responsable: Utilisateur
{
    public ICollection<Edt> edts { get; set; } = new List<Edt>();
    public ICollection<Message> messages { get; set; } = new List<Message>();
}