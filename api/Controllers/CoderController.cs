﻿using api.Infrashtructure.Helpers;
using api.DTOs;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using api.Infrashtructure.Repositories;

namespace api.Controllers
{
    [Route("api/coder")]
    [ApiController]
    public class CoderController : ControllerBase
    {
        private readonly CoderRepository _coderRepository;

        public CoderController(CoderRepository coderRepository)
        {
            _coderRepository = coderRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCoders([FromQuery] QueryObject query, string? sortField = null, bool ascending = true)
        {
            try
            {
                var result = await _coderRepository.GetAllCoderAsync(query, sortField, ascending);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateCoder([FromForm] CreateCoderDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }
            try
            {
                var result = await _coderRepository.CreateCoderAsync(dto);
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCoderByID(int id)
        {
            try
            {
                var coder = await _coderRepository.GetCoderByIdAsync(id);

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
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoder(int id, [FromForm] CoderDetailDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _coderRepository.UpdateCoderAsync(id, dto);
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
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoder(int id)
        {
            try
            {
                var isDeleted = await _coderRepository.DeleteCoderAsync(id);

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
