using api.DTOs;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly EnrollmentRepository _enrollmentRepository;
        private readonly AuthService _authService;

        public EnrollmentController (EnrollmentRepository enrollmentRepository, AuthService authService)
        {
            _enrollmentRepository = enrollmentRepository;
            _authService = authService;
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EnrollmentDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            dto.CoderID = _authService.GetUserIdFromToken();
            if(dto.CoderID == -1)
            {
                return Unauthorized();
            }

            try
            {
                var result = await _enrollmentRepository.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = result.EnrollmentID }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var enrollment = await _enrollmentRepository.GetByIdAsync(id);
            if (enrollment == null)
                return NotFound(new { message = $"Không tìm thấy bản ghi Enrollment với ID = {id}." });

            return Ok(enrollment);
        }

        [HttpGet("list-enroll/{coderId}")]
        public async Task<IActionResult> GetByCoder(int coderId)
        {
            try
            {
                var result = await _enrollmentRepository.GetEnrollmentsByCoderID(coderId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("CheckEnrollment")]
        public async Task<IActionResult> CheckEnrollment(int coderId, int courseId)
        {
            bool isEnrolled = await _enrollmentRepository.CheckCoderEnrolledAsync(coderId, courseId);

            return Ok(new { isEnrolled });
        }

        [HttpDelete]
        public async Task<IActionResult> Unenroll([FromBody] EnrollmentDTO request)
        {
            try
            {
                await _enrollmentRepository.DeleteByCourseAndCoderAsync(request.CourseID, request.CoderID);
                return Ok();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

    }
}
