using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;
using Microsoft.AspNetCore.Mvc;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly CourseRepository _courseRepository;
        private readonly AuthService _authService;

        public CourseController(CourseRepository courseRepository, AuthService authService)
        {
            _courseRepository = courseRepository;
            _authService = authService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? keyword, int page = 1, int pageSize = 10)
        {
            try
            {
                var result = await _courseRepository.SearchCourseAsync(keyword, page, pageSize);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _courseRepository.GetAllCoursesAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var result = await _courseRepository.GetCourseByIdAsync(id);
                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy khóa học với ID {id}" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [HttpGet("problem-count")]
        public async Task<IActionResult> CountProblemByCourseId(int courseId)
        {
            try
            {
                var result = await _courseRepository.CountProblemByCourseId(courseId);
                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy khóa học với ID {courseId}" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CourseCreateDTO courseDto)
        {

            if (courseDto == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            courseDto.CoderID = _authService.GetUserIdFromToken();

            if(courseDto.CoderID == -1)
            {
                return Unauthorized();
            }

            try
            {
                var result = await _courseRepository.CreateCourseAsync(courseDto);
                return CreatedAtAction(nameof(GetById), new { id = result.CourseID }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CourseDetailDTO courseDto)
        {
            if (courseDto == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            courseDto.CoderID = _authService.GetUserIdFromToken();

            if (courseDto.CoderID == -1)
            {
                return Unauthorized();
            }


            try
            {
                var result = await _courseRepository.UpdateCourseAsync(id, courseDto);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Không tìm thấy khóa học với ID {id}" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _courseRepository.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Không tìm thấy khóa học với ID {id}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }
    }

}
