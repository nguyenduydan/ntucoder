using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class Comment
    {
        public int CommentID { get; set; }
        public int BlogID { get; set; }
        public string Content { get; set; }
        public int CoderID { get; set; }
        public DateTime CommentTime { get; set; } = DateTime.Now;

        public virtual Blog Blog { get; set; }

        public virtual Coder Coder { get; set; }
    }
}
