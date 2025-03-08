﻿#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class Account
    {
        public int AccountID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string SaltMD5 { get; set; }
        public string? PwdResetCode { get; set; }
        public DateTime? PwdResetDate { get; set; }
        public string? ReceiveEmail { get; set; }
        public int RoleID { get; set; }
        public virtual Role Role { get; set; }
        public virtual Coder Coder { get; set; }
        // Một tài khoản có thể tạo nhiều khóa học
        public virtual ICollection<Course> Courses { get; set; } = new HashSet<Course>();
    }
}
