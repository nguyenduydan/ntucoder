#pragma warning disable CS8618 // Non-nullable field
using api.Infrashtructure.Enums;

namespace api.Models.ERD
{
    public class Submission
    {
        public int SubmissionID { get; set; }

        public int CoderID { get; set; }

        public int CompilerID { get; set; }

        public int ProblemID { get; set; }
        public int TakePartID { get; set; }

        public DateTime SubmitTime { get; set; }

        public string SubmissionCode { get; set; }

        public SubmissionStatus SubmissionStatus { get; set; }

        public int? TestRunCount { get; set; }
        public string? TestResult { get; set; }
        public string? MaxMemorySize { get; set; }
        public string? MaxTimeDuration { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public virtual Coder Coder { get; set; }
        public virtual Compiler Compiler { get; set; }
        public virtual Problem Problem { get; set; }
        public virtual ICollection<TestRun> TestRuns { get; set; } = new HashSet<TestRun>();
    }
}
