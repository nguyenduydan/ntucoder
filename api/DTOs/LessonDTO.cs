using api.Models.ERD;

namespace api.DTOs
{
    public class LessonDTO
    {
        public int LessonID { get; set; }
        public int TopicID { get; set; }
        public string TopicName { get; set; }
        public string LessonTitle { get; set; }
        public string? LessonContent { get; set; }
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
    }

    public class LessonDetailDTO: LessonDTO
    {
        public List<LessonProblemDTO> LessonProblems { get; set; } = new List<LessonProblemDTO>();
    }
}