namespace api.Models.ERD
{
    public class Badge
    {
        public int BadgeID { get; set; }
        public string Name { get; set; } // VD: "COMBO", "HOT", "NEW"
        public string? Description { get; set; } // Mô tả về nhãn
        public string? Color { get; set; } // Mã màu hiển thị nhãn (VD: "#FFD700")

        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();
    }
}
