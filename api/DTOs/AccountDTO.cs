using api.Models.ERD;

namespace api.DTOs
{
    public class AccountDTO
    {
        public int AccountID { get; set; }
        public string UserName { get; set; }
        public string? ReceiveEmail { get; set; }
        public int RoleID { get; set; }
    }
}
