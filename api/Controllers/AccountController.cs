using api.DTOs;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AccountRepository _accountRepository;
        private readonly AuthService _authService;

        public AccountController(AccountRepository accountRepository, AuthService authService)
        {
            _accountRepository = accountRepository;
            _authService = authService;
        }

        [Authorize]
        [HttpPost("{coderId}/repassword")]
        public async Task<IActionResult> RePassword(int coderId, [FromBody] RePasswordDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            coderId = _authService.GetUserIdFromToken();

            if (coderId == -1) return Unauthorized();

            try
            {
                var success = await _accountRepository.RePasswordAsyncByCoderId(coderId, model);
                if (!success)
                    return StatusCode(500, "Đổi mật khẩu thất bại.");

                return Ok(new { message = "Đổi mật khẩu thành công." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // Log lỗi
                Console.WriteLine($"Lỗi hệ thống: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Lỗi hệ thống.");
            }
        }

    }
}
