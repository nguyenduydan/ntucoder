namespace api.DTOs
{
    public class CourseDTO
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; }
        public string Description { get; set; }
        public int CoderID { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
        public decimal Fee { get; set; }
        public decimal? OriginalFee { get; set; }
        public int? DiscountPercent { get; set; }
        public double Rating { get; set; }
        public int TotalReviews { get; set; }
        public bool IsCombo { get; set; }
        public int? BadgeID { get; set; }
        public string? ImageUrl { get; set; }
    }
}
