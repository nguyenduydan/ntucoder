using api.DTOs;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CodeExecuteController : ControllerBase
    {
        public readonly CodeExecutionService _codeExecutionService;
        public readonly TestCaseRepository _testCaseRepository;

        public CodeExecuteController(CodeExecutionService codeExecutionService, TestCaseRepository testCaseRepository)
        {
            _codeExecutionService = codeExecutionService;
            _testCaseRepository = testCaseRepository;
        }

        [HttpPost("{submissionId}")]
        public async Task<IActionResult> ExecuteCode(int submissionId)
        {
            try
            {
                var testRunResults = await _codeExecutionService.ExecuteSubmissionAsync(submissionId);

                if (testRunResults == null || !testRunResults.Any())
                {
                    return BadRequest(new { message = "Không có test case nào để chạy." });
                }

                return Ok(testRunResults);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
        [HttpPost("try-run")]
        public async Task<IActionResult> TryRunCode([FromBody] TryRunCodeRequestDTO request)
        {
            try
            {
                var results = await _codeExecutionService.TryRunMultipleTestCasesAsync(
                    request.SourceCode,
                    request.CompilerExtension,
                    request.ProblemId
                );

                return Ok(new { results });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPost("multi-sub")]
        public async Task<IActionResult> ExecuteMultipleCodes([FromBody] List<int> submissionIds)
        {
            try
            {
                if (submissionIds == null || !submissionIds.Any())
                {
                    return BadRequest(new { message = "Danh sách submissions không hợp lệ." });
                }

                var testRunResults = await _codeExecutionService.ExecuteSubmissionsAsync(submissionIds);

                return Ok(testRunResults);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi server: " + ex.Message });
            }
        }
    }
}
