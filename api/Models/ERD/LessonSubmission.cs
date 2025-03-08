namespace api.Models.ERD
{
    public class LessonSubmission
    {
        public int LessonSubmissionID { get; set; }

        // FK tới Lessons
        public int LessonID { get; set; }

        // FK tới Submissions
        public int SubmissionID { get; set; }

        public double Score { get; set; }

        public string? Feedback { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        // Navigation properties
        public virtual Lesson Lesson { get; set; }
        public virtual Submission Submission { get; set; }
    }
}
