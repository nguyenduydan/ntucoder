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
        private readonly ProgressRepository _progressRepository;

        public SubmissionController(SubmissionRepository submissionRepository, CodeExecutionService codeExecutionService, AuthService authService, ProgressRepository progressRepository)
        {
            _submissionRepository = submissionRepository;
            _codeExecutionService = codeExecutionService;
            _authService = authService;
            _progressRepository = progressRepository;
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
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] SubmissionDTO dto)
        {
            if (dto == null)
                return BadRequest(new { Errors = new List<string> { "Dữ liệu không hợp lệ." } });

            try
            {
                var coderID = _authService.GetUserIdFromToken();
                dto.CoderID = coderID;
                dto.SubmissionStatus = SubmissionStatus.Pending;

                var submission = await _submissionRepository.CreateSubmissionAsync(dto);

                var testRunResults = await _codeExecutionService.ExecuteSubmissionAsync(submission.SubmissionID);

                await _submissionRepository.UpdateSubmissionAfterTestRunAsync(submission.SubmissionID);

                var updatedSubmission = await _submissionRepository.GetSubmissionByIdAsync(submission.SubmissionID);


                if (updatedSubmission.SubmissionStatus == SubmissionStatus.Accepted)
                {
                    await _submissionRepository.ProcessSolvedAndMatchAsync(updatedSubmission); // tính điểm 
                    if (updatedSubmission.SubmissionStatus == SubmissionStatus.Accepted)
                    {
                        await _submissionRepository.ProcessSolvedAndMatchAsync(updatedSubmission); // tính điểm 

                        // Lấy CourseID từ ProblemID
                        var courseId = await _progressRepository.GetCourseIdFromProblemAsync(updatedSubmission.ProblemID);
                        if (courseId != null)
                        {
                            await _progressRepository.UpdateCourseProgressAsync(updatedSubmission.CoderID, courseId.Value);
                        }
                    }

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

        [HttpGet("history")]
        public async Task<IActionResult> GetHistoryListSubmission(
                [FromQuery] QueryObject query,
                [FromQuery] int? problemId=null,
                [FromQuery] string? sortField = null,
                [FromQuery] bool ascending = true,
                [FromQuery] int? coderId = null)
        {
            var result = await _submissionRepository.GetSubmissionHistoryAsync(
                     query,
                     problemId,
                     sortField,
                     ascending,
                      coderId);

            return Ok(result);
        }
    }
}
