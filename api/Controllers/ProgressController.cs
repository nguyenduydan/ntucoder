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

        [HttpGet("course")]
        public async Task<IActionResult> GetCourseProgress(int courseId)
        {
            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1) return Unauthorized();

            var result = await _progressRepository.GetCourseProgressAsync(courseId, coderId);
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
