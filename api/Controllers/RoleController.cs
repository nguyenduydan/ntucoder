using api.Infrashtructure.Helpers;
using api.DTOs;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using api.Infrashtructure.Repositories;

namespace api.Controllers
{
    [Route("api/role")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly RoleRepository _roleRepository;

        public RoleController (RoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        [HttpGet("getlist")]
        public async Task<IActionResult> GetAllRole([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _roleRepository.GetAllRoleAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateRole([FromBody] RoleDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _roleRepository.CreateRoleAsync(dto);
                return CreatedAtAction(nameof(CreateRole), new { id = result.RoleID }, result);
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

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            try
            {
                var isDeleted = await _roleRepository.DeleteRoleAsync(id);

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
