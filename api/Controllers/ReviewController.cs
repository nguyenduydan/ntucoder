using api.DTOs;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewRepository _reviewRepository;
        private readonly AuthService _authService;

        public ReviewController(ReviewRepository reviewRepository, AuthService authService)
        {
            _reviewRepository = reviewRepository;
            _authService = authService;
        }

        [HttpGet]
        public async Task<ActionResult> GetReviews(int courseId)
        {
            var reviews = await _reviewRepository.GetReviewsByCourseIdAsync(courseId);
            return Ok(reviews);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReviewDTO>> AddReview(int courseId, [FromBody] ReviewDTO reviewDto)
        {
            reviewDto.CoderID = _authService.GetUserIdFromToken();
            if (reviewDto.CoderID == -1)
            {
                return Unauthorized();
            }

            reviewDto.CourseID = courseId;

            var result = await _reviewRepository.AddOrUpdateReviewAsync(reviewDto);

            await _reviewRepository.UpdateCourseRatingAsync(courseId);

            return Ok(result);
        }

        [HttpPut("update-rating")]
        public async Task<ActionResult> UpdateCourseRating(int courseId)
        {
            await _reviewRepository.UpdateCourseRatingAsync(courseId);
            return NoContent();
        }
    }

}
