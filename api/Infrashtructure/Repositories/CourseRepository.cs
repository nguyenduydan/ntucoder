using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class CourseRepository
    {
        private readonly ApplicationDbContext _context;

        public CourseRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<CourseDTO>> GetAllCoursesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryData = _context.Courses
                .AsNoTracking()
                .Include(c => c.CourseCategory)
                .Include(c => c.Creator)
                .Include(c => c.Badge)
                .Select(c => new CourseDTO
                {
                    CourseID = c.CourseID,
                    CourseName = c.CourseName,
                    CoderID = c.CoderID,
                    Status = c.Status,
                    CourseCategoryID = c.CourseCategoryID,
                    CourseCategoryName = c.CourseCategory.Name,
                    Fee = c.Fee,
                    OriginalFee = c.OriginalFee,
                    IsCombo = c.IsCombo,
                    BadgeID = c.BadgeID,
                    BadgeName = c.Badge != null ? c.Badge.Name : null,
                });

            queryData = ApplySorting(queryData, sortField, ascending);

            var courses = await PagedResponse<CourseDTO>.CreateAsync(
                queryData,
                query.Page,
                query.PageSize
            );

            return courses;
        }


        public IQueryable<CourseDTO> ApplySorting(IQueryable<CourseDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "coursename" => ascending ? query.OrderBy(c => c.CourseName) : query.OrderByDescending(c => c.CourseName),
                "status" => ascending ? query.OrderBy(c => c.Status) : query.OrderByDescending(c => c.Status),
                "fee" => ascending ? query.OrderBy(c => c.Fee) : query.OrderByDescending(c => c.Fee),
                "iscombo" => ascending ? query.OrderBy(c => c.IsCombo) : query.OrderByDescending(c => c.IsCombo),
                _ => query.OrderBy(c => c.CourseID) // Mặc định sắp xếp theo CourseID nếu không có trường hợp nào khớp
            };
        }
        public async Task<CourseCreateDTO> CreateCourseAsync(CourseCreateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CourseName))
            {
                throw new ArgumentException("Tên khóa học không được để trống.", nameof(dto.CourseName));
            }

            bool isExisting = await _context.Courses
                .AsNoTracking()
                .AnyAsync(c => c.CourseName == dto.CourseName);

            if (isExisting)
            {
                throw new InvalidOperationException("Tên khóa học đã tồn tại.");
            }

            var newCourse = new Course
            {
                CourseName = dto.CourseName,
                Description = dto.Description,
                CoderID = dto.CoderID,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = dto.Status,
                CourseCategoryID = dto.CourseCategoryID,
                Fee = dto.Fee,
                OriginalFee = dto.OriginalFee,
                DiscountPercent = dto.OriginalFee > 0
                    ? (int)Math.Round(((dto.OriginalFee.Value - dto.Fee) / dto.OriginalFee.Value) * 100)
                    : 0,
                IsCombo = dto.IsCombo,
                BadgeID = dto.BadgeID,
                ImageUrl = dto.ImageUrl
            };

            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();

            return dto;
        }

        public async Task<CourseDetailDTO> UpdateCourseAsync(int id, CourseDetailDTO dto)
        {
            var existingCourse = await _context.Courses
                .Include(c => c.Topics)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (existingCourse == null)
            {
                throw new KeyNotFoundException($"Khóa học với ID {id} không tồn tại.");
            }

            existingCourse.CourseName = dto.CourseName;
            existingCourse.Description = dto.Description;
            existingCourse.CoderID = dto.CoderID;
            existingCourse.UpdatedAt = DateTime.UtcNow;
            existingCourse.Status = dto.Status;
            existingCourse.CourseCategoryID = dto.CourseCategoryID;
            existingCourse.Fee = dto.Fee;
            existingCourse.OriginalFee = dto.OriginalFee;
            existingCourse.IsCombo = dto.IsCombo;
            existingCourse.BadgeID = dto.BadgeID;
            existingCourse.ImageUrl = dto.ImageUrl;

            // Tính lại DiscountPercent tự động
            existingCourse.DiscountPercent = existingCourse.OriginalFee > 0
                ? (int)Math.Round(((existingCourse.OriginalFee.Value - existingCourse.Fee) / existingCourse.OriginalFee.Value) * 100)
                : 0;

            _context.Courses.Update(existingCourse);
            await _context.SaveChangesAsync();

            return new CourseDetailDTO
            {
                CourseID = existingCourse.CourseID,
                CourseName = existingCourse.CourseName,
                Description = existingCourse.Description,
                CreatorName = dto.CreatorName,
                CreatedAt = existingCourse.CreatedAt,
                UpdatedAt = existingCourse.UpdatedAt,
                Status = existingCourse.Status,
                CourseCategoryID = existingCourse.CourseCategoryID,
                Fee = existingCourse.Fee,
                OriginalFee = existingCourse.OriginalFee,
                DiscountPercent = existingCourse.DiscountPercent,
                IsCombo = existingCourse.IsCombo,
                BadgeID = existingCourse.BadgeID,
                ImageUrl = existingCourse.ImageUrl,
                Rating = dto.Rating,
                TotalReviews = dto.TotalReviews,
                Topics = dto.Topics,
                Enrollments = dto.Enrollments,
                Comments = dto.Comments,
                Reviews = dto.Reviews
            };
        }

        public async Task<CourseDetailDTO> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Topics)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (course == null)
            {
                throw new KeyNotFoundException($"Khóa học với ID {id} không tồn tại.");
            }

            return new CourseDetailDTO
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                Description = course.Description,
                CreatorName = "Tên người tạo", // Thay thế bằng truy vấn thực tế nếu có
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Status = course.Status,
                CourseCategoryID = course.CourseCategoryID,
                Fee = course.Fee,
                OriginalFee = course.OriginalFee,
                DiscountPercent = course.DiscountPercent,
                IsCombo = course.IsCombo,
                BadgeID = course.BadgeID,
                ImageUrl = course.ImageUrl,
                Rating = 0, // Có thể cần lấy từ bảng khác nếu có
                TotalReviews = 0, // Có thể cần lấy từ bảng khác nếu có
                Topics = course.Topics.Select(t => new TopicDTO
                {
                    TopicID = t.TopicID,
                    TopicName = t.TopicName
                }).ToList(),
                Enrollments = course.Enrollments.Select(e => new EnrollmentDTO
                {
                    EnrollmentID = e.EnrollmentID,
                    CoderID = e.CoderID,
                    EnrolledAt = e.EnrolledAt
                }).ToList(),
                Comments = new List<CommentDTO>(), // Thêm truy vấn nếu có bảng bình luận
                Reviews = new List<ReviewDTO>() // Thêm truy vấn nếu có bảng đánh giá
            };
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (course == null)
            {
                throw new KeyNotFoundException("Khóa học không tồn tại.");
            }

            if (course.Enrollments.Any())
            {
                throw new InvalidOperationException("Không thể xóa khóa học có học viên đã đăng ký.");
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return true;
        }


    }
}
