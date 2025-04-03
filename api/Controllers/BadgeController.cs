using api.Infrashtructure.Helpers;
using api.DTOs;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using api.Infrashtructure.Repositories;


namespace api.Controllers
{
    [Route("api/badge")]
    [ApiController]
    public class BadgeController: ControllerBase
    {
        private readonly BadgeRepository _badgeRepository;

        public BadgeController(BadgeRepository badgeRepository)
        {
            _badgeRepository = badgeRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBadge([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _badgeRepository.GetAllBadgeAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBadge([FromBody] BadgeDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _badgeRepository.CreateBadgeAsync(dto);
                return CreatedAtAction(nameof(CreateBadge), new { id = result.BadgeID }, result);
            }
            catch (ValidationException ex)
            {
                return BadRequest(new { Errors = ex.Errors.Select(e => e.ErrorMessage).ToList() });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoder(int id)
        {
            try
            {
                var isDeleted = await _badgeRepository.DeleteBadgeAsync(id);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        Message = "Xóa coder thành công."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Message = "Không tìm thấy coder với ID được cung cấp."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra khi xóa coder.",
                    Error = ex.Message
                });
            }
        }

    }
}
