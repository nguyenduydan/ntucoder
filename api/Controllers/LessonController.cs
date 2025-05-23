﻿using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LessonController : ControllerBase
    {
        private readonly LessonRepository _repo;

        public LessonController(LessonRepository lessonRepository)
        {
            _repo = lessonRepository;
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
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _repo.GetListAsync(query, sortField, ascending);
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
                var result = await _repo.GetByIdAsync(id);
                if (result == null)
                {
                    return NotFound(new { message = $"Không tìm thấy bài học với ID {id}" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LessonDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            try
            {
                var result = await _repo.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.LessonID }, result);
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

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] LessonDetailDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            try
            {
                var result = await _repo.UpdateAsync(id, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Không tìm thấy bài học với ID {id}" });
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
                await _repo.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = $"Không tìm thấy bài học với ID {id}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi máy chủ nội bộ", error = ex.Message });
            }
        }
    }

}
