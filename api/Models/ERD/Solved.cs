using System.ComponentModel.DataAnnotations.Schema;
#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class Solved
    {
        public int CoderID { get; set; }
        public int ProblemID { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Problem Problem { get; set; }
    }
}
