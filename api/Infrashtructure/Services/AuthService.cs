using api.Infrashtructure.Helpers;
using api.Models.ERD;
using api.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(ApplicationDbContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
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

        private (string token, DateTime expires) GenerateJwtToken(Account user)
        {
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]);
            var expireMinutes = Convert.ToDouble(_config["JwtSettings:ExpireMinutes"]);
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

    }
}
