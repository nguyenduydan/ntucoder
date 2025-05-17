using api.DTOs;
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

        [HttpGet]
        public async Task<ActionResult<List<BlogDTO>>> GetAll()
        {
            var blogs = await _repository.GetAllAsync();
            return Ok(blogs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _repository.GetByIdAsync(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BlogDTO dto)
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
