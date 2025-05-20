namespace api.DTOs
{
    public class SuggestionDTO
    {
        public string Label { get; set; }       // Tên hiển thị
        public string Type { get; set; }        // Loại (Course, Coder, Blog, ...)
        public int? Id { get; set; }            // Optional, dùng nếu cần redirect detail
    }
}
