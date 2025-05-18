using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class Blog
    {
        public int BlogID { get; set; }
        public string Title { get; set; }
        public string? BlogImage { get; set; }
        public DateTime BlogDate { get; set; }
        public string Content { get; set; }
        public int? ViewCount { get; set; }
        public int Published { get; set; }
        public int PinHome { get; set; }
        public int CoderID { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();

    }
}
