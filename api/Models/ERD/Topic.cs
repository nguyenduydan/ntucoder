namespace api.Models.ERD
{
    public class Topic
    {
        public int TopicID { get; set; }
        public int CourseID { get; set; } // FK
        public string TopicName { get; set; }
        public string TopicDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
        public Course Course { get; set; }
        public virtual ICollection<Lesson> Lessons { get; set; } = new HashSet<Lesson>();
    }
}