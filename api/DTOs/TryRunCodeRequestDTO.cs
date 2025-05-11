namespace api.DTOs
{
    public class TryRunCodeRequestDTO
    {
        public string SourceCode { get; set; }
        public string CompilerExtension { get; set; }
        public int ProblemId { get; set; }
    }
}
