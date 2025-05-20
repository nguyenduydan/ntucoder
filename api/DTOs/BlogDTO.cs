namespace api.DTOs
{
    public class BlogDTO
    {
        public int BlogID { get; set; }
        public int CoderID { get; set; }
        public string? CoderName { get; set; }
        public int? ViewCount { get; set; }
        public string? AvatarCoder {  get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? ImageBlogUrl { get; set; }
        public string Title { get; set; }
        public DateTime BlogDate { get; set; }
        public string Content { get; set; }
        public int Published { get; set; } = 0;
        public int PinHome { get; set; } = 0;

        public List<CommentDTO> Comments { get; set; } = new List<CommentDTO>();

    }

    public class UpdateStatusDTO
    {
        public int? Published { get; set; }
        public int? PinHome { get; set; } 
    }
}
