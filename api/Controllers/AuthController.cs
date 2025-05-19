using api.DTOs;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models.ERD;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly CoderRepository _coderRepository;
        private readonly IConfiguration _config;

        public AuthController (AuthService authService, CoderRepository coderRepository, IConfiguration configuration)
        {
            _authService = authService;
            _coderRepository = coderRepository;
            _config = configuration;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AccountDTO model)
        {
            if (model == null || string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest();
            }

            var (token, user, expires) = await _authService.AuthenticateAsync(model.UserName, model.Password);
            if (token == null || user == null || expires == null)
            {
                return Unauthorized("Sai tên đăng nhập hoặc mật khẩu");
            }

            var coder = await _coderRepository.GetCoderByIdAsync(user.AccountID);
            if (coder == null)
            {
                return BadRequest("Không tìm thấy.");
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expires.Value
            };
            Response.Cookies.Append("token", token, cookieOptions);
            return Ok(new
            {
                token,
                AccountID = user.AccountID,
                Username = user.UserName,
                RoleID = user.RoleID,
                CoderName = coder.CoderName,
                avatar = coder.Avatar,
                Expires = expires.Value.ToLocalTime().ToString("o") // ISO format: dễ parse ở FE
            });
        }


        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // nếu sử dụng HTTPS
                SameSite = SameSiteMode.None,
            });

            return Ok(new { message = "Đăng xuất thành công" });
        }

        [Authorize(Roles = "1")]
        [HttpGet("protected-route")]
        public IActionResult ProtectedRoute()
        {
            return Ok();
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            try
            {
                var coderID = _authService.GetUserIdFromToken();
                var coder = await _coderRepository.GetCoderByIdAsync(coderID);

                if (coder == null)
                {
                    return NotFound(new { message = "Coder không tồn tại." });
                }
                return Ok(new
                {
                    CoderID = coderID,
                    CoderName = coder.CoderName,
                    avatar = coder.Avatar,
                    RoleID = coder.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Đã xảy ra lỗi." });
            }
        }
        [AllowAnonymous]
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthDTO model)
        {
            if (string.IsNullOrEmpty(model.Token))
                return BadRequest("Token không hợp lệ");

            try
            {
                var clientId = _config["GoogleAuthSettings:ClientId"];
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new[] { clientId }
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(model.Token, settings);

                CoderDTO coderDTO = await _coderRepository.GetCoderByEmailAsync(payload.Email);

                Account account;

                if (coderDTO == null)
                {
                    account = await _authService.CreateGoogleUserAsync(payload.Email, payload.Name, payload.Picture);
                    coderDTO = await _coderRepository.GetCoderByIdAsync(account.AccountID);
                }
                else
                {
                    account = await _coderRepository.GetAccountByCoderIdAsync(coderDTO.CoderID);
                }

                // Tạo JWT token trực tiếp
                var (token, expires) = _authService.GenerateJwtToken(account);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                };
                Response.Cookies.Append("token", token, cookieOptions);

                return Ok(new
                {
                    token,
                    AccountID = account.AccountID,
                    RoleID = account.RoleID,
                    CoderName = coderDTO?.CoderName
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = "Xác thực Google thất bại", detail = ex.Message });
            }
        }


        // 1. Gửi mã reset mật khẩu
        [HttpPost("send-reset-code")]
        public async Task<IActionResult> SendResetCode([FromBody] ForgetPasswordDTO request)
        {
            var result = await _authService.SendPasswordResetCodeAsync(request.Email);
            if (!result.Success) return BadRequest(result.Message);
            return Ok(result.Message);
        }

        // 2. Xác thực mã reset mật khẩu
        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] ForgetPasswordDTO request)
        {
            var result = await _authService.VerifyResetCodeAsync(request.Email, request.Code);
            if (!result.Success) return BadRequest(result.Message);
            return Ok(result.Message);
        }

        // 3. Đổi mật khẩu mới
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ForgetPasswordDTO request)
        {
            var updateResult = await _coderRepository.UpdatePasswordAsync(request.Email, request.NewPassword);
            if (!updateResult.Success) return BadRequest(updateResult.Message);
            return Ok(updateResult.Message);
        }

    }
}
