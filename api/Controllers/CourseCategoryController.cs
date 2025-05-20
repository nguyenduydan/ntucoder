using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseCategoryController : ControllerBase
    {
        private readonly CourseCategoryRepository _repo;

        public CourseCategoryController(CourseCategoryRepository Repository)
        {
            _repo = Repository;
        }

        // ✅ Lấy danh sách danh mục có phân trang
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var result = await _repo.GetAllAsync(query, sortField, ascending);
            return Ok(result);
        }

        // ✅ Tạo danh mục mới
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CourseCategoryDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            try
            {
                var createdCategory = await _repo.CreateCategoryAsync(dto);
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
            var isDeleted = await _repo.DeleteAsync(id);
            if (!isDeleted)
                return NotFound(new { message = "Không tìm thấy danh mục khóa học." });

            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? keyword, int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            try
            {
                var result = await _repo.SearchAsync(keyword, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }
    }
}
