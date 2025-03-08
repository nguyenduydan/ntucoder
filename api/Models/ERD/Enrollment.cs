namespace api.Models.ERD
{
    public class Enrollment
    {
        public int EnrollmentID { get; set; }

        // FK tới Courses
        public int CourseID { get; set; }

        // FK tới Coders
        public int CoderID { get; set; }

        public DateTime EnrolledAt { get; set; }

        // Navigation properties
        public virtual Course Course { get; set; }
        public virtual Coder Coder { get; set; }
    }
}
