namespace api.DTOs
{
    public class ReviewDTO
    {
        public int ReviewID { get; set; }
        public int CourseID { get; set; }
        public int CoderID { get; set; }
        public string? CoderName { get; set; }
        public int Rating { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}