using api.DTOs;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace api.Infrashtructure.Repositories
{
    public class AccountRepository
    {
        private readonly ApplicationDbContext _context;

        public AccountRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm đổi mật khẩu
        public async Task<bool> RePasswordAsyncByCoderId(int coderId, RePasswordDTO dto)
        {
            if (dto.Password != dto.Repassword)
                throw new ArgumentException("Mật khẩu mới và xác nhận mật khẩu không khớp.");

            var account = await GetAccountByCoderIdAsync(coderId);
            if (account == null)
                throw new ArgumentException("Tài khoản không tồn tại cho coder này.");

            var hashedOldPassword = HashPassword(dto.OldPassword, account.SaltMD5);
            if (hashedOldPassword != account.Password)
                throw new ArgumentException("Mật khẩu hiện tại không chính xác.");

            var salt = account.SaltMD5 ?? GenerateSalt();
            account.SaltMD5 = salt;

            account.Password = HashPassword(dto.Password, salt);

            // Reset code, dùng cho trường hợp quên mật khẩu
            account.PwdResetCode = null;
            account.PwdResetDate = null;

            _context.Accounts.Update(account);
            var updated = await _context.SaveChangesAsync();

            return updated > 0;
        }


        public async Task<Account?> GetAccountByCoderIdAsync(int coderId)
        {
            // Giả sử Account có navigation property Coder với khóa ngoại
            return await _context.Accounts
                .Include(a => a.Coder)
                .FirstOrDefaultAsync(a => a.Coder.CoderID == coderId);
        }
        private static string GenerateSalt()
        {
            // Sinh salt 16 bytes base64
            var buffer = new byte[16];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(buffer);
            }
            return Convert.ToBase64String(buffer);
        }

        // Hàm băm mật khẩu – không thay đổi
        public static string HashPassword(string password, string salt)
        {
            var combined = password + salt;
            using (var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(combined));
                return Convert.ToBase64String(hashedBytes);
            }
        }

    }
}
