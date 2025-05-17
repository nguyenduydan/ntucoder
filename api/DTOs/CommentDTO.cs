namespace api.DTOs
{
    public class CommentDTO
    {
        public int? ParentCommentID { get; set; }
        public int CoderID { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? BlogID { get; set; }
        public int? CourseID { get; set; }
        public DateTime? CommentTime { get; set; }
    }

    public class CommentResponseDto: CommentDTO
    {
        public int CommentID { get; set; }
        public string CoderName { get; set; } = string.Empty;
        public string? CoderAvatar { get; set; }
        public List<CommentResponseDto>? Replies { get; set; }
    }

}
