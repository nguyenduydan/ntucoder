namespace api.DTOs
{
    public class CourseCategoryDTO
    {
        public int CourseCategoryID { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }

        // Danh sách ID các khóa học thuộc danh mục này
        public List<int> CourseIDs { get; set; } = new List<int>();
    }

}
