namespace api.Models.ERD
{
    public class Lesson
    {
        public int LessonID { get; set; }
        public int TopicID { get; set; } // FK
        public string LessonTitle { get; set; }
        public string LessonContent { get; set; }
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
        public virtual Topic Topic { get; set; }
        public virtual ICollection<LessonSubmission> LessonSubmissions { get; set; } = new HashSet<LessonSubmission>();
    }
}