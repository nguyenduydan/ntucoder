using api.Infrashtructure.Enums;

namespace api.DTOs
{
    public class ProgressDTO
    {
        public int ObjectID { get; set; }
        public ProgressObjectType ObjectType { get; set; }
        public string? OjectName { get; set; }
        public int CoderID { get; set; }
        public double Percent { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
