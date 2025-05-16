using api.Infrashtructure.Enums;

namespace api.Models.ERD
{
    public class Progress
    {
         public int ProgressID { get; set; }

        public int CoderID { get; set; }           // Người dùng
        public int ObjectID { get; set; }          // ID của đối tượng (Lesson, Topic, Course,...)
        public ProgressObjectType ObjectType { get; set; }  // Kiểu đối tượng

        public double Percent { get; set; }        // Từ 0 -> 100
        public DateTime LastUpdated { get; set; }
    }
}
