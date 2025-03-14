namespace api.Models.ERD
{
    public class LessonProblem
    {
        public int ID { get; set; }
        public int LessonID { get; set; }
        public int ProblemID { get; set; }

        public virtual Lesson Lesson { get; set; }
        public virtual Problem Problem { get; set; }
    }

}
