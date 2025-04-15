using api.Models.ERD;

namespace api.DTOs
{
    public class TopicDTO
    {
        public int TopicID { get; set; }
        public int CourseID { get; set; } // FK
        public string? CourseName { get; set; }
        public string? TopicName { get; set; }
        public string? TopicDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
    }

    public class TopicDetailDTO : TopicDTO
    {
        public List<LessonDTO> Lessons { get; set; } = new List<LessonDTO>();
    }

}