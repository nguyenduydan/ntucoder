using api.Infrashtructure.Helpers;
using api.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using api.Infrashtructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using api.Infrashtructure.Services;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoderController : ControllerBase
    {
        private readonly CoderRepository _repo;
        private readonly AuthService _authService;

        public CoderController(CoderRepository coderRepository, AuthService authService)
        {
            _repo = coderRepository;
            _authService = authService;
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
        [HttpGet]
        public async Task<IActionResult> GetAllCoders([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _repo.GetAllCoderAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoderByID(int id)
        {
            try
            {
                var coder = await _repo.GetCoderByIdAsync(id);

                if (coder == null)
                {
                    return NotFound(new { Message = "Không tìm thấy coder với ID được cung cấp." });
                }

                return Ok(coder);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("top-hightest")]
        public async Task<IActionResult> GetTopHightest()
        {
            try
            {
                var result = await _repo.GetTop3HighestAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <param name="q">Từ khóa tìm kiếm theo tên coder</param>
        [HttpGet("list-ranking")]
        public async Task<IActionResult> GetListRanking([FromQuery] QueryObject query, [FromQuery] string? q)
        {
            try
            {
                var result = await _repo.GetListCoderRakingAsync(query, q);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        [HttpPost]
        public async Task<IActionResult> CreateCoder([FromBody] CreateCoderDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _repo.CreateCoderAsync(dto);
                return CreatedAtAction(nameof(CreateCoder), new { id = result.CoderID }, result);
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
    
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoder(int id, [FromForm] CoderDetailDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _repo.UpdateCoderAsync(id, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                    Console.WriteLine($"Inner Exception Stack Trace: {ex.InnerException.StackTrace}");
                }
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoder(int id)
        {
            try
            {
                var isDeleted = await _repo.DeleteCoderAsync(id);

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
