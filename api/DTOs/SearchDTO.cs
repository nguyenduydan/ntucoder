namespace api.DTOs
{
    public class SearchDTO
    {
        public string? Keyword { get; set; }          // Từ khóa tìm kiếm
        public int Page { get; set; } = 1;            // Trang hiện tại
        public int PageSize { get; set; } = 10;       // Số lượng item mỗi trang
        public string? Type { get; set; }             // Loại tìm kiếm (user, blog, lesson, v.v.)
    }

    public class SearchSuggestionDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Type { get; set; } = "";  // "coder", "course", "blog"
    }
}
