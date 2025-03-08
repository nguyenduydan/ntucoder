using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class ProblemCategory
    {
        public int ProblemID { get; set; }
        public int CategoryID { get; set; }
        public string? Note { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual Category Category { get; set; }
    }
}
