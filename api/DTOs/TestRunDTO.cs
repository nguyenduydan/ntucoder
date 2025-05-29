namespace api.DTOs
{
    public class TestRunDTO
    {
        public int TestRunID { get; set; }
        public int SubmissionID { get; set; }
        public int TestCaseID { get; set; }
        public int TimeDuration { get; set; }
        public int MemorySize { get; set; }
        public string? TestOutput { get; set; }
        public string? Result { get; set; }
        public string? CheckerLog { get; set; }
    }

    public class TestRunResultDTO
    {
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
        public string ActualOutput { get; set; }
        public string Result { get; set; }
        public string Error { get; set; }
        public int Time { get; set; }
    }
}
