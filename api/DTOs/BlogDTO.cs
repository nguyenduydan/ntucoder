namespace api.DTOs
{
    public class BlogDTO
    {
        public int BlogID { get; set; }
        public int CoderID { get; set; }
        public string? CoderName { get; set; }
        public string? Avatar { get; set; }
        public string Title { get; set; }
        public DateTime BlogDate { get; set; }
        public string Content { get; set; }
        public int Published { get; set; } = 0;
        public int PinHome { get; set; } = 0;
        
    }
}
