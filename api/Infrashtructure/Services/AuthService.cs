using api.Infrashtructure.Helpers;
using api.Models.ERD;
using api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Mail;
using api.Infrastructure.Helpers;


namespace api.Infrashtructure.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMemoryCache _cache;
        private readonly EmailHelper _emailHelper;

        public AuthService(ApplicationDbContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor, IMemoryCache cache, EmailHelper emailHelper)
        {
            _context = context;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _cache = cache;
            _emailHelper =  emailHelper;
        }

        public async Task<(string? token, Account? user, DateTime? expires)> AuthenticateAsync(string username, string password)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null || !PasswordHelper.VerifyPassword(password, user.Password, user.SaltMD5))
            {
                return (null, null, null);
            }

            var (token, expires) = GenerateJwtToken(user);
            return (token, user, expires);
        }

        public (string token, DateTime? expires) GenerateJwtToken(Account user)
        {
            var secretKey = _config["JwtSettings:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new Exception("JWT SecretKey is missing in configuration.");
            }

            var key = Encoding.UTF8.GetBytes(secretKey);

            if (!double.TryParse(_config["JwtSettings:ExpireMinutes"], out var expireMinutes))
            {
                expireMinutes = 1440; // mặc định 1 ngày
            }

            var expires = DateTime.UtcNow.AddMinutes(expireMinutes);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.AccountID.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                new Claim(ClaimTypes.Role, user.RoleID.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }


        public int GetUserIdFromToken()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out int userId) ? userId : -1;
        }

        //Login by Google
        public async Task<Account> CreateGoogleUserAsync(string email, string name, string pictureUrl)
        {
            if (await _context.Accounts.AnyAsync(a => a.UserName == email))
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }

            var account = new Account
            {
                UserName = email,
                Password = "",
                SaltMD5 = "",
                RoleID = 2,
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var coder = new Coder
            {
                CoderID = account.AccountID,
                CoderName = name,
                CoderEmail = email,
                PhoneNumber = null,
                Gender = Enums.GenderEnum.other,
                Avatar = pictureUrl,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "google",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "google"
            };

            _context.Coders.Add(coder);
            await _context.SaveChangesAsync();

            return account;
        }


        // Gửi mã code reset mật khẩu về email
        public async Task<(bool Success, string Message)> SendPasswordResetCodeAsync(string email)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.ReceiveEmail == email);

            if (user == null)
                return (false, "Không tìm thấy người dùng với email này.");

            var code = CodeHelper.GenerateNumericCode(6);

            user.PwdResetCode = code;
            user.PwdResetDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var subject = "Mã đặt lại mật khẩu của bạn";
            var body = $@"
                <div style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                    <div style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);'>
                        <h2 style='color: #333333; text-align: center;'>Yêu cầu đặt lại mật khẩu</h2>
                        <p style='font-size: 16px; color: #555;'>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                        <p style='font-size: 16px; color: #555;'>Mã xác nhận của bạn là:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <span style='display: inline-block; font-size: 32px; font-weight: bold; color: #ffffff; background-color: #007bff; padding: 15px 30px; border-radius: 8px; letter-spacing: 4px;'>{code}</span>
                        </div>
                        <p style='font-size: 14px; color: #888;'>Mã xác nhận có hiệu lực trong vòng <strong>5 phút</strong>.</p>
                        <p style='font-size: 14px; color: #888;'>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                    </div>
                </div>";


            try
            {
                await _emailHelper.SendEmailAsync(user.ReceiveEmail!, subject, body);
                return (true, "Mã đặt lại mật khẩu đã được gửi đến email của bạn.");
            }
            catch (SmtpException ex)
            {
                // Log lỗi chi tiết nếu cần
                return (false, $"Lỗi SMTP khi gửi email: {ex.Message}");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi khi gửi email: {ex.Message}");
            }
        }

        // Xác thực mã code reset mật khẩu
        public async Task<(bool Success, string Message)> VerifyResetCodeAsync(string email, string code)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.ReceiveEmail == email);

            if (user == null)
                return (false, "Không tìm thấy người dùng với email này.");

            if (string.IsNullOrEmpty(user.PwdResetCode) || user.PwdResetDate == null)
                return (false, "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");

            if (user.PwdResetCode != code)
                return (false, "Mã đặt lại mật khẩu không đúng.");

            if (user.PwdResetDate.Value.AddMinutes(30) < DateTime.UtcNow)
                return (false, "Mã đặt lại mật khẩu đã hết hạn.");

            return (true, "Mã đặt lại mật khẩu hợp lệ.");
        }
    }
}
