namespace api.DTOs
{
    public class EnrollmentDTO
    {
        public int EnrollmentID { get; set; }
        public int CourseID { get; set; }
        public int CoderID { get; set; }
        public DateTime EnrolledAt { get; set; }
    }

}