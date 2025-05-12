using api.DTOs;
using api.Infrashtructure.Enums;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionController : ControllerBase
    {
        private readonly SubmissionRepository _submissionRepository;
        private readonly CodeExecutionService _codeExecutionService;
        private readonly AuthService _authService;

        public SubmissionController(SubmissionRepository submissionRepository, CodeExecutionService codeExecutionService, AuthService authService)
        {
            _submissionRepository = submissionRepository;
            _codeExecutionService = codeExecutionService;
            _authService = authService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllSubmissions([FromQuery] QueryObject query, string? sortField = null, bool ascending = true, string? searchString = null, string? compilerFilter = null)
        {
            try
            {
                var result = await _submissionRepository.GetAllSubmissionsAsync(query, sortField, ascending, searchString, compilerFilter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSubmission([FromBody] SubmissionDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var coderID = _authService.GetUserIdFromToken();
                dto.CoderID = coderID;

                // 1. Luôn tạo submission với status ban đầu là Pending
                dto.SubmissionStatus = SubmissionStatus.Pending;

                var result = await _submissionRepository.CreateSubmissionAsync(dto);

                // 2. Chạy test
                var testRunResults = await _codeExecutionService.ExecuteSubmissionAsync(result.SubmissionID);

                // 3. Cập nhật submission dựa trên test result
                await _submissionRepository.UpdateSubmissionAfterTestRunAsync(result.SubmissionID);

                // 4. Tải lại submission để kiểm tra status sau khi update
                var updatedSubmission = await _submissionRepository.GetSubmissionByIdAsync(result.SubmissionID);

                // 5. Nếu đã được Accepted, xử lý Solved và Match
                if (updatedSubmission.SubmissionStatus == SubmissionStatus.Accepted)
                {
                    await _submissionRepository.ProcessSolvedAndMatchAsync(updatedSubmission);
                }

                return Ok(new
                {
                    Submission = updatedSubmission,
                    TestRuns = testRunResults,
                    SubmissionStatus = updatedSubmission.SubmissionStatus,
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Errors = new List<string> { ex.Message } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }


        // Get problem by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmissionById(int id)
        {
            try
            {
                var problem = await _submissionRepository.GetSubmissionByIdAsync(id);

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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubmission([FromBody] SubmissionDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });
            }

            try
            {
                var result = await _submissionRepository.UpdateSubmissionAsync(dto);
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
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            try
            {
                var isDeleted = await _submissionRepository.DeleteSubmissionAsync(id);

                if (isDeleted)
                {
                    return Ok();
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Có lỗi xảy ra.",
                    Error = ex.Message
                });
            }
        }
        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetHistoryListSubmission(int problemId, string? sortField = null, bool ascending = true)
        {
            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1)
            {
                return Unauthorized();
            }
            List<SubmissionDTO> list = await _submissionRepository.GetListSubmissionFromCoderIdAsync(problemId, coderId, sortField, ascending);
            return Ok(list);
        }
        [HttpGet("profile")]
        public async Task<IActionResult> GetListProblemByCoderId(int coderID)
        {
            try
            {
                List<SubmissionDTO> list = await _submissionRepository.GetListSubmissionByCoderId(coderID);
                return Ok(list);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
    }
}
