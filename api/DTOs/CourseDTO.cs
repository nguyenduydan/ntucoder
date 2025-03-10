namespace api.DTOs
{
    public class CourseDTO
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; }
        public int CoderID { get; set; } = 1;
        public int CourseCategoryID { get; set; }
        public string CourseCategoryName { get; set; } = string.Empty; // Tránh lỗi null
        public decimal Fee { get; set; }
        public decimal? OriginalFee { get; set; }
        public bool IsCombo { get; set; }
        public int? BadgeID { get; set; }
        public string BadgeName { get; set; } = string.Empty; // Tránh lỗi null
        public int Status { get; set; }

        // Tự động tính % giảm giá
        public int DiscountPercent => OriginalFee > 0
            ? (int)Math.Round(((OriginalFee.Value - Fee) / OriginalFee.Value) * 100)
            : 0;
    }

    public class CourseCreateDTO: CourseDTO
    {
        public string Description { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class CourseDetailDTO : CourseDTO
    {
        public int? DiscountPercent {  get; set; }
        public string Description { get; set; } = string.Empty;
        public string CreatorName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public double Rating { get; set; }
        public int TotalReviews { get; set; }
        public List<TopicDTO> Topics { get; set; } = new List<TopicDTO>();
        public List<EnrollmentDTO> Enrollments { get; set; } = new List<EnrollmentDTO>();
        public List<CommentDTO> Comments { get; set; } = new List<CommentDTO>();
        public List<ReviewDTO> Reviews { get; set; } = new List<ReviewDTO>();
    }
}
