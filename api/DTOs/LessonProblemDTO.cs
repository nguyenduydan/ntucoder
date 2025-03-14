namespace api.DTOs
{
    public class LessonProblemDTO
    {
        public int ID { get; set; }
        public int LessonID { get; set; }
        public int ProblemID { get; set; }
        public string? ProblemName { get; set; }
    }
}
