using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/coursecategory")]
    [ApiController]
    public class CourseCategoryController : ControllerBase
    {
        private readonly CourseCategoryService _service;

        public CourseCategoryController(CourseCategoryService service)
        {
            _service = service;
        }

        // ✅ Lấy danh sách danh mục có phân trang
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var result = await _service.GetAllCategoriesAsync(query, sortField, ascending);
            return Ok(result);
        }

        // ✅ Tạo danh mục mới
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CourseCategoryDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            try
            {
                var createdCategory = await _service.CreateCategoryAsync(dto);
                return CreatedAtAction(nameof(GetAll), new { id = createdCategory.CourseCategoryID }, createdCategory);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi. Vui lòng thử lại!", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var isDeleted = await _service.DeleteAsync(id);
            if (!isDeleted)
                return NotFound(new { message = "Không tìm thấy danh mục khóa học." });

            return NoContent();
        }
    }
}
