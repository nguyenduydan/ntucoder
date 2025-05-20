using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Services;
using api.Infrastructure.Helpers;
using api.Models.ERD;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class CourseRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly MinioService _minioService;

        public CourseRepository(ApplicationDbContext context, MinioService minioService)
        {
            _context = context;
            _minioService = minioService;
        }

        public async Task<PagedResponse<CourseDTO>> GetAllCoursesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryData = GetQueryable();
            queryData = ApplySorting(queryData, sortField, ascending);
            return await PagedResponse<CourseDTO>.CreateAsync(queryData, query.Page, query.PageSize);
        }

        public IQueryable<CourseDTO> ApplySorting(IQueryable<CourseDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "coursename" => ascending ? query.OrderBy(c => c.CourseName) : query.OrderByDescending(c => c.CourseName),
                "status" => ascending ? query.OrderBy(c => c.Status) : query.OrderByDescending(c => c.Status),
                "fee" => ascending ? query.OrderBy(c => c.Fee) : query.OrderByDescending(c => c.Fee),
                "iscombo" => ascending ? query.OrderBy(c => c.IsCombo) : query.OrderByDescending(c => c.IsCombo),
                _ => query.OrderBy(c => c.CourseID)
            };
        }

        public async Task<CourseCreateDTO> CreateCourseAsync(CourseCreateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CourseName))
                throw new ArgumentException("Tên khóa học không được để trống.", nameof(dto.CourseName));

            bool isExisting = await _context.Courses
                .AsNoTracking()
                .AnyAsync(c => c.CourseName == dto.CourseName);

            if (isExisting)
                throw new InvalidOperationException("Tên khóa học đã tồn tại.");

            if (dto.ImageFile != null)
            {
                using var stream = dto.ImageFile.OpenReadStream();
                var fileName = $"imgCourse/{dto.CourseID + "_" + dto.CoderID}.jpg";
                dto.ImageUrl = await _minioService.UploadFileAsync(stream, fileName, "ntucoder");
            }

            var newCourse = new Course
            {
                CourseName = dto.CourseName,
                Description = dto.Description,
                Overview = dto.Overview,
                CoderID = dto.CoderID,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Status = dto.Status,
                CourseCategoryID = dto.CourseCategoryID,
                Fee = dto.Fee ?? 0,
                OriginalFee = dto.OriginalFee,
                DiscountPercent = dto.DiscountPercent,
                IsCombo = dto.IsCombo,
                BadgeID = dto.BadgeID,
                ImageUrl = dto.ImageUrl,
            };

            _context.Courses.Add(newCourse);
            await _context.SaveChangesAsync();

            // Trả về đối tượng CourseCreateDTO, có thể cập nhật nếu muốn trả về DTO từ Course (khuyến nghị)
            return dto;
        }

        public async Task<CourseDetailDTO> UpdateCourseAsync(int id, CourseDetailDTO dto)
        {
            var course = await _context.Courses
                .Include(c => c.Creator)
                .Include(c => c.CourseCategory)
                .Include(c => c.Badge)
                .Include(c => c.Topics)
                .Include(c => c.Enrollments)
                .Include(c => c.Reviews)
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (course == null)
                throw new KeyNotFoundException($"Khóa học với ID {id} không tồn tại.");

            if (!string.IsNullOrEmpty(dto.CourseName)) course.CourseName = dto.CourseName;
            if (!string.IsNullOrEmpty(dto.Description)) course.Description = dto.Description;
            if (!string.IsNullOrEmpty(dto.Overview)) course.Overview = dto.Overview;
            if (dto.Fee.HasValue) course.Fee = dto.Fee.Value;
            if (dto.OriginalFee.HasValue) course.OriginalFee = dto.OriginalFee.Value;
            if (dto.BadgeID.HasValue) course.BadgeID = dto.BadgeID;
            if (dto.CourseCategoryID != 0) course.CourseCategoryID = dto.CourseCategoryID;
            course.Status = dto.Status;
            course.IsCombo = dto.IsCombo;
            course.UpdatedAt = DateTime.Now;

            if (dto.ImageFile != null)
            {
                using var stream = dto.ImageFile.OpenReadStream();
                var fileName = $"imgCourse/{course.CourseID + "_" + course.CoderID}.jpg";
                course.ImageUrl = await _minioService.UploadFileAsync(stream, fileName, "ntucoder");
            }

            if (dto.Fee.HasValue || dto.OriginalFee.HasValue)
            {
                course.DiscountPercent = course.OriginalFee > 0
                    ? (int)Math.Round(((course.OriginalFee.Value - course.Fee) / course.OriginalFee.Value) * 100)
                    : 0;
            }

            await _context.SaveChangesAsync();

            return MapToCourseDetailDto(course);
        }

        public async Task<CourseDetailDTO> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                .Include(c => c.Creator)
                .Include(c => c.CourseCategory)
                .Include(c => c.Badge)
                .Include(c => c.Topics)
                .Include(c => c.Enrollments).ThenInclude(e => e.Coder)
                .Include(c => c.Reviews).ThenInclude(r => r.Coder)
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (course == null)
                throw new KeyNotFoundException($"Khóa học với ID {id} không tồn tại.");

            return MapToCourseDetailDto(course);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (course == null)
                throw new KeyNotFoundException("Khóa học không tồn tại.");

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> CountProblemByCourseId(int courseId)
        {
            var problemCount = await _context.Topics
                .Where(t => t.CourseID == courseId)
                .SelectMany(t => _context.Lessons.Where(l => l.TopicID == t.TopicID))
                .SelectMany(l => _context.LessonProblems.Where(lp => lp.LessonID == l.LessonID))
                .Select(lp => lp.ProblemID)
                .Distinct()
                .CountAsync();

            return problemCount;
        }

        public async Task<PagedResponse<CourseDTO>> SearchCourseAsync(string? keyword, int page, int pageSize)
        {
            var query = GetQueryable();

            query = SearchHelper<CourseDTO>.ApplySearchMultiField(query, keyword, useAnd: true,
                c => c.CourseName,
                c => c.CourseCategoryName,
                c => c.BadgeName,
                c => c.CreatorName);

            return await PagedResponse<CourseDTO>.CreateAsync(query, page, pageSize);
        }

        // Chuẩn hóa - lấy dữ liệu dạng IQueryable<CourseDTO>
        private IQueryable<CourseDTO> GetQueryable()
        {
            var enrollCounts = _context.Enrollments
                .GroupBy(e => e.CourseID)
                .Select(g => new { CourseID = g.Key, Count = g.Count() });

            var reviewAvgs = _context.Reviews
                .GroupBy(r => r.CourseID)
                .Select(g => new { CourseID = g.Key, AvgRating = g.Average(r => r.Rating) });

            var query = _context.Courses
                .Include(c => c.Creator)
                .Include(c => c.CourseCategory)
                .Include(c => c.Badge)
                .AsSplitQuery()
                .AsNoTracking()
                .GroupJoin(enrollCounts,
                    c => c.CourseID,
                    ec => ec.CourseID,
                    (c, ec) => new { c, ec })
                .SelectMany(
                    temp => temp.ec.DefaultIfEmpty(),
                    (temp, ec) => new { temp.c, EnrollCount = ec != null ? ec.Count : 0 })
                .GroupJoin(reviewAvgs,
                    temp => temp.c.CourseID,
                    ra => ra.CourseID,
                    (temp, ra) => new { temp.c, temp.EnrollCount, ra })
                .SelectMany(
                    temp => temp.ra.DefaultIfEmpty(),
                    (temp, ra) => new { temp.c, temp.EnrollCount, AvgRating = ra != null ? (double?)ra.AvgRating : null })
                .Select(x => new CourseDTO
                {
                    CourseID = x.c.CourseID,
                    CourseName = x.c.CourseName,
                    CoderID = x.c.CoderID,
                    CreatorName = x.c.Creator.CoderName ?? string.Empty,
                    CourseCategoryID = x.c.CourseCategoryID,
                    CourseCategoryName = x.c.CourseCategory.Name ?? string.Empty,
                    Fee = x.c.Fee,
                    OriginalFee = x.c.OriginalFee,
                    IsCombo = x.c.IsCombo,
                    BadgeID = x.c.BadgeID,
                    BadgeName = x.c.Badge.Name ?? string.Empty,
                    BadgeColor = x.c.Badge.Color,
                    ImageUrl = x.c.ImageUrl,
                    Status = x.c.Status,
                    Rating = x.AvgRating,
                    TotalReviews = x.EnrollCount
                });

            return query;
        }

        private CourseDTO MapToCourseDto(Course course, int enrollmentCount = 0, double? rating = null)
        {
            return new CourseDTO
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CoderID = course.CoderID,
                CreatorName = course.Creator?.CoderName ?? string.Empty,
                CourseCategoryID = course.CourseCategoryID,
                CourseCategoryName = course.CourseCategory?.Name ?? string.Empty,
                Fee = course.Fee,
                OriginalFee = course.OriginalFee,
                IsCombo = course.IsCombo,
                BadgeID = course.BadgeID,
                BadgeName = course.Badge?.Name ?? string.Empty,
                BadgeColor = course.Badge?.Color,
                ImageUrl = course.ImageUrl,
                Status = course.Status,
                Rating = rating,
                TotalReviews = enrollmentCount
            };
        }

        private CourseDetailDTO MapToCourseDetailDto(Course course)
        {
            return new CourseDetailDTO
            {
                CourseID = course.CourseID,
                CourseName = course.CourseName,
                CoderID = course.CoderID,
                CreatorName = course.Creator?.CoderName ?? string.Empty,
                CourseCategoryID = course.CourseCategoryID,
                CourseCategoryName = course.CourseCategory?.Name ?? string.Empty,
                Fee = course.Fee,
                OriginalFee = course.OriginalFee,
                IsCombo = course.IsCombo,
                BadgeID = course.BadgeID,
                BadgeName = course.Badge?.Name ?? string.Empty,
                BadgeColor = course.Badge?.Color,
                ImageUrl = course.ImageUrl,
                Status = course.Status,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Description = course.Description,
                Overview = course.Overview,
                Rating = course.Reviews.Any() ? course.Reviews.Average(r => r.Rating) : 0,
                TotalReviews = course.Enrollments?.Count,
                Topics = course.Topics.Select(t => new TopicDTO
                {
                    TopicID = t.TopicID,
                    TopicName = t.TopicName
                }).ToList(),
                Enrollments = course.Enrollments.Select(e => new EnrollmentDTO
                {
                    EnrollmentID = e.EnrollmentID,
                    CoderID = e.CoderID,
                    CoderName = e.Coder?.CoderName,
                    EnrolledAt = e.EnrolledAt
                }).ToList(),
                Reviews = course.Reviews.Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewID,
                    CourseID = r.CourseID,
                    CoderID = r.CoderID,
                    CoderName = r.Coder?.CoderName ?? "Unknown",
                    Rating = r.Rating,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt
                }).ToList(),
                Comments = new List<CommentDTO>() // Nếu chưa load comments
            };
        }
    }
}
