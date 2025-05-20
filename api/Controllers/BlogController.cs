using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models;
using api.Models.ERD;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly BlogRepository _repository;
        private readonly AuthService _authService;

        public BlogController(BlogRepository repository, AuthService authService)
        {
            _repository = repository;
            _authService = authService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? keyword, int page = 1, int pageSize = 10)
        {
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            try
            {
                var result = await _repository.SearchAsync(keyword, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<PagedResponse<BlogDTO>>> GetAll([FromQuery] QueryObject query, int? coderID)
        {
            try
            {
                var blogs = await _repository.GetAllAsync(query, coderID);
                return Ok(blogs);
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi lấy danh sách blog.", error = ex.Message });
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _repository.GetByIdAsync(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] BlogDTO dto)
        {
            try
            {
                // Lấy CoderID từ token
                var coderId = _authService.GetUserIdFromToken();
                if (coderId == -1) return Unauthorized();

                dto.CoderID = coderId;

                var blog = await _repository.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = blog.BlogID }, blog);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BlogDTO dto)
        {
            try
            {
                var coderId = _authService.GetUserIdFromToken();
                if (coderId == -1) return Unauthorized();

                dto.CoderID = coderId;

                var success = await _repository.UpdateAsync(id, dto);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDTO dto)
        {
            var success = await _repository.UpdateStatusAsync(id, dto);
            if (!success) return NotFound();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/view")]
        public async Task<IActionResult> IncreaseView(int id)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var result = await _repository.IncreaseViewAsync(id, ip);
            return Ok(new { increased = result = true });
        }

        [HttpGet("TopViewed")]
        public async Task<IActionResult> GetTopViewed([FromQuery] int count = 4)
        {
            try
            {
                var result = await _repository.GetTopViewedBlogsAsync(count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
            }
        }

        [HttpGet("Latest")]
        public async Task<IActionResult> GetLatest([FromQuery] QueryObject query, [FromQuery] string excludedIds = null)
        {
            try
            {
                List<int> excludedList = new List<int>();
                if (!string.IsNullOrEmpty(excludedIds))
                {
                    excludedList = excludedIds
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(idStr => int.TryParse(idStr, out int id) ? id : (int?)null)
                        .Where(id => id.HasValue)
                        .Select(id => id.Value)
                        .ToList();
                }

                var result = await _repository.GetLatestAsync(query, excludedList);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
            }
        }
    }
}
