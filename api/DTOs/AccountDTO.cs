﻿using api.Models.ERD;

namespace api.DTOs
{
    public class AccountDTO
    {
        public string UserName { get; set; }
        public string Password { get; set; }

    }

    public class AccountDetailDTO : AccountDTO
    {
        public int AccountID { get; set; }
        public string SaltMD5 { get; set; }
        public string? PwdResetCode { get; set; }
        public DateTime? PwdResetDate { get; set; }
        public string? ReceiveEmail { get; set; }
        public int RoleID { get; set; }
    }

    // DTOs cho request
    public class ForgetPasswordDTO
    {
        public string? Email { get; set; }
        public string? Code { get; set; }
        public string? NewPassword { get; set; }

    }

    public class RePasswordDTO
    {
        public string OldPassword { get; set; }
        public string Password { get; set; }
        public string Repassword { get; set; }
    }

    public class GoogleAuthDTO
    {
        public string Token { get; set; }
    }
}
