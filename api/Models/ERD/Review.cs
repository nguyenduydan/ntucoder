namespace api.Models.ERD
{
    public class Review
    {
        public int ReviewID { get; set; }
        public int CourseID { get; set; }
        public int BlogID { get; set; }
        public int CoderID { get; set; }
        public int Rating { get; set; } 
        public string Content { get; set; } 
        public DateTime CreatedAt { get; set; }

        public virtual Course Course { get; set; }
        public virtual Coder Coder { get; set; }
    }
}
