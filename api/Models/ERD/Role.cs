using api.Infrashtructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class Role
    {
        public int RoleID { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Account> Accounts { get; set; } = new HashSet<Account>();
    }
}
