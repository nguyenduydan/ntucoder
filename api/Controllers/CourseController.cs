using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Services;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly CourseService _courseService;

        public CourseController(CourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            var result = await _courseService.GetAllCoursesAsync(query, sortField, ascending);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _courseService.GetCourseByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CourseCreateDTO courseDto)
        {
            var result = await _courseService.CreateCourseAsync(courseDto);
            return CreatedAtAction(nameof(GetById), new { id = result.CourseID }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] CourseDetailDTO courseDto)
        {
            var result = await _courseService.UpdateCourseAsync(id, courseDto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _courseService.DeleteCourseAsync(id);
            return NoContent();
        }
    }
}
