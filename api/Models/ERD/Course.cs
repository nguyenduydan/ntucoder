namespace api.Models.ERD
{
    public class Course
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; }
        public string? Description { get; set; }
        public string? Overview { get; set; }
        public int CoderID { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
        public int CourseCategoryID { get; set; }
        public virtual CourseCategory CourseCategory { get; set; }
        // Giá học phí
        public decimal Fee { get; set; }
        public decimal? OriginalFee { get; set; }
        public int? DiscountPercent { get; set; }

        // Thông tin đánh giá
        public double Rating { get; set; }

        // Nhãn và combo
        public bool IsCombo { get; set; }
        public int? BadgeID { get; set; }
        public virtual Badge? Badge { get; set; } // Liên kết với bảng Badge

        // Ảnh khóa học
        public string? ImageUrl { get; set; }

        public virtual Coder Creator { get; set; }
        public virtual ICollection<Topic> Topics { get; set; } = new HashSet<Topic>();
        public virtual ICollection<Enrollment> Enrollments { get; set; } = new HashSet<Enrollment>();
        public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
        public virtual ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
    }
}
