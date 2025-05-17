﻿using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemController : ControllerBase
    {
        private readonly ProblemRepository _problemRepository;
        private readonly AuthService _autService; 

        public ProblemController(ProblemRepository problemRepository, AuthService authService)
        {
            _problemRepository = problemRepository;
            _autService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProblems([FromQuery] QueryObject query, string? sortField = null, bool ascending = true, bool published = false)
        {
            try
            {
                var result = await _problemRepository.GetAllProblemsAsync(query, sortField, ascending, published);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateProblem([FromBody] ProblemDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            dto.CoderID = _autService.GetUserIdFromToken();
            if(dto.CoderID == -1) return Unauthorized();
            try
            {
                var result = await _problemRepository.CreateProblemAsync(dto);
                return CreatedAtAction(nameof(CreateProblem), new { id = result.ProblemID }, result);
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

        // Get problem by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProblemById(int id)
        {
            try
            {
                var problem = await _problemRepository.GetProblemByIdAsync(id);

                if (problem == null)
                {
                    return NotFound(new { Message = "Không tìm thấy vấn đề với ID được cung cấp." });
                }

                return Ok(problem);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Update a problem by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProblem(int id, [FromForm] ProblemDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _problemRepository.UpdateProblemAsync(id, dto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Delete a problem by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProblem(int id)
        {
            try
            {
                var isDeleted = await _problemRepository.DeleteProblemAsync(id);

                if (isDeleted)
                {
                    return Ok(new
                    {
                        Message = "Xóa bài tập thành công."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Message = "Không tìm thấy bài tập với ID được cung cấp."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra khi xóa bài tập.",
                    Error = ex.Message
                });
            }
        }
    }
}
