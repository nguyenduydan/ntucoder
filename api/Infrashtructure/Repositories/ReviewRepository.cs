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
        public async Task<ReviewDTO> AddReviewAsync(ReviewDTO dto)
        {
            var review = new Review
            {
                CourseID = dto.CourseID,
                CoderID = dto.CoderID,
                Rating = dto.Rating,
                Content = dto.Content,
                CreatedAt = DateTime.Now
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var coder = await _context.Coders
                .Where(c => c.CoderID == dto.CoderID)
                .FirstOrDefaultAsync();


            return new ReviewDTO
            {
                ReviewID = review.ReviewID,
                CourseID = review.CourseID,
                CoderID = review.CoderID,
                Rating = review.Rating,
                Content = review.Content,
                CreatedAt = review.CreatedAt,
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
                    CoderName = rc.coder.CoderName, // Accessing CoderName from Coders table
                    CreatedAt = rc.review.CreatedAt
                })
                .ToListAsync();
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
