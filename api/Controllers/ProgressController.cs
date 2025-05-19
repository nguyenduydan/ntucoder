using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController : ControllerBase
    {
        private readonly ProgressRepository _progressRepository;
        private readonly AuthService _authService;

        public ProgressController(ProgressRepository progressRepository, AuthService authService)
        {
            _authService = authService;
            _progressRepository = progressRepository;
        }

        [HttpGet("courses")]
        public async Task<IActionResult> GetCoursesProgress([FromQuery] List<int>? courseIds, int? coderId = null)
        {
            var currentUserId = _authService.GetUserIdFromToken();
            if (currentUserId == -1) return Unauthorized();

            if (courseIds == null || !courseIds.Any())
                return BadRequest("CourseIds is required.");

            var targetCoderId = coderId ?? currentUserId;

            var result = await _progressRepository.GetCoursesProgressAsync(courseIds, targetCoderId);
            return Ok(result);
        }

        [HttpGet("topic-summary")]
        public async Task<IActionResult> GetTopicSummary(int courseId)
        {
            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1) return Unauthorized();

            var result = await _progressRepository.GetTopicProgressSummaryAsync(courseId, coderId);
            return Ok(result);
        }

        [HttpGet("lesson-summary")]
        public async Task<IActionResult> GetLessonSummary(int topicId)
        {
            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1) return Unauthorized();

            var result = await _progressRepository.GetLessonProgressSummaryAsync(topicId, coderId);
            return Ok(result);
        }

        [HttpGet("solved-problems")]
        public async Task<IActionResult> GetSolvedProblems(int lessonId)
        {
            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1) return Unauthorized();

            var result = await _progressRepository.GetSolvedProblems(coderId, lessonId);
            return Ok(result);
        }

    }
}
