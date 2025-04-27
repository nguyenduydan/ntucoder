namespace api.Models.ERD
{
    public class Match
    {
        public int MatchID { get; set; }
        public int CoderID { get; set; }
        public int LessonProblemID { get; set; }
        public int Point {  get; set; }

        public virtual Coder Coder { get; set; }
        public virtual LessonProblem LessonProblem { get; set; }    
    }
}
