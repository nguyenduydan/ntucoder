﻿namespace api.DTOs
{
    public class CommentDTO
    {
        public int CommentID { get; set; }
        public int CoderID { get; set; }
        public string Content { get; set; }
        public DateTime CommentTime { get; set; }
        public int? BlogID { get; set; }
        public int? CourseID { get; set; }
    }

}
