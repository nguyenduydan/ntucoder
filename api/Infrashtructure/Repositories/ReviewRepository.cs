using api.DTOs;
using api.Models.ERD;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class ReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Thêm đánh giá
        public async Task<ReviewDTO> AddOrUpdateReviewAsync(ReviewDTO dto)
        {
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.CourseID == dto.CourseID && r.CoderID == dto.CoderID);

            if (existingReview != null)
            {
                // Update
                existingReview.Rating = dto.Rating;
                existingReview.Content = dto.Content;
                existingReview.CreatedAt = DateTime.Now;

                _context.Reviews.Update(existingReview);
                await _context.SaveChangesAsync();
            }
            else
            {
                // Create new
                var newReview = new Review
                {
                    CourseID = dto.CourseID,
                    CoderID = dto.CoderID,
                    Rating = dto.Rating,
                    Content = dto.Content,
                    CreatedAt = DateTime.Now
                };

                _context.Reviews.Add(newReview);
                await _context.SaveChangesAsync();
                existingReview = newReview;
            }

            return new ReviewDTO
            {
                ReviewID = existingReview.ReviewID,
                CourseID = existingReview.CourseID,
                CoderID = existingReview.CoderID,
                Rating = existingReview.Rating,
                Content = existingReview.Content,
                CreatedAt = existingReview.CreatedAt
            };
        }



        // Lấy danh sách đánh giá của 1 khoá học
        public async Task<List<ReviewDTO>> GetReviewsByCourseIdAsync(int courseId)
        {
            return await _context.Reviews
                .Where(r => r.CourseID == courseId)
                .OrderByDescending(r => r.CreatedAt)
                .Join(_context.Coders,
                    review => review.CoderID,
                    coder => coder.CoderID,
                    (review, coder) => new { review, coder })
                .Select(rc => new ReviewDTO
                {
                    ReviewID = rc.review.ReviewID,
                    CourseID = rc.review.CourseID,
                    CoderID = rc.review.CoderID,
                    Rating = rc.review.Rating,
                    Content = rc.review.Content,
                    CoderName = rc.coder.CoderName, 
                    CreatedAt = rc.review.CreatedAt
                })
                .ToListAsync()
                ;
        }

        // Cập nhật điểm trung bình rating trong bảng Courses
        public async Task UpdateCourseRatingAsync(int courseId)
        {
            var ratings = await _context.Reviews
                .Where(r => r.CourseID == courseId)
                .Select(r => (double?)r.Rating)
                .ToListAsync();

            double avgRating = ratings.Any() ? ratings.Average() ?? 0 : 0;

            var course = await _context.Courses.FindAsync(courseId);
            if (course != null)
            {
                course.Rating = avgRating;
                await _context.SaveChangesAsync();
            }
        }
    }
}
