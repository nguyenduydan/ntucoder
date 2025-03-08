namespace api.Infrashtructure.Enums
{
    public enum SubmissionStatus
    {
        Pending = 0,
        Accepted = 1,
        WrongAnswer = 2,
        TimeLimitExceeded = 3,
        MemoryLimitExceeded = 4,
        RuntimeError = 5,
        CompilationError = 6
    }
}