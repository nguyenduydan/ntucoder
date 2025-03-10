namespace api.Models.ERD
{
    public class CourseCategory
    {
        public int CourseCategoryID { get; set; }
        public string Name { get; set; }
        public int Order { get; set; } // Thứ tự hiển thị danh mục

        // Một danh mục có nhiều khóa học
        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();
    }

}
