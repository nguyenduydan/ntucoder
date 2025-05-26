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
            if (string.IsNullOrEmpty(sortField))
                return query.OrderBy(c => c.CourseID);

            return sortField.ToLower() switch
            {
                "coursename" => ascending ? query.OrderBy(c => c.CourseName) : query.OrderByDescending(c => c.CourseName),
                "enrollcount" => ascending ? query.OrderBy(c => c.EnrollCount) : query.OrderByDescending(c => c.EnrollCount),
                "createdat" => ascending ? query.OrderBy(c => c.CreatedAt) : query.OrderByDescending(c => c.CreatedAt),
                "updatedat" => ascending ? query.OrderBy(c => c.UpdatedAt) : query.OrderByDescending(c => c.UpdatedAt),
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

            // Đây là chỗ mới - thống kê review theo CoderID
            var reviewStatsByCoder = _context.Reviews
                .GroupBy(r => r.Course.CoderID)
                .Select(g => new
                {
                    CoderID = g.Key,
                    AvgRating = g.Average(r => r.Rating),
                    TotalReviews = g.Count()
                });

            var query = _context.Courses
                .Include(c => c.Creator)
                .Include(c => c.CourseCategory)
                .Include(c => c.Badge)
                .Include(c => c.Reviews)
                .AsNoTracking()
                .Where (c => c.Status == 1)
                .GroupJoin(enrollCounts,
                    c => c.CourseID,
                    ec => ec.CourseID,
                    (c, ec) => new { c, ec })
               .SelectMany(
                    temp => temp.ec.DefaultIfEmpty(),
                    (temp, ec) => new { temp.c, EnrollCount = ec != null ? (int?)ec.Count : null })

                .GroupJoin(reviewStatsByCoder,
                    temp => temp.c.CoderID,
                    rs => rs.CoderID,
                    (temp, rs) => new { temp.c, temp.EnrollCount, rs })
                .SelectMany(
                    temp => temp.rs.DefaultIfEmpty(),
                    (temp, rs) => new
                    {
                        temp.c,
                        temp.EnrollCount,
                        AvgRating = rs != null ? (double?)rs.AvgRating : null,
                        TotalReviews = rs != null ? rs.TotalReviews : 0
                    })
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
                    EnrollCount = ((int?)x.EnrollCount).GetValueOrDefault(),
                    TotalReviews = x.c.Reviews != null ? x.c.Reviews.Count() : 0,
                    CreatedAt = x.c.CreatedAt,
                    UpdatedAt = x.c.UpdatedAt,
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
                CourseName = course.CourseName ?? string.Empty,
                CoderID = course.CoderID,
                CreatorName = course.Creator?.CoderName ?? string.Empty,
                CourseCategoryID = course.CourseCategoryID,
                CourseCategoryName = course.CourseCategory?.Name ?? string.Empty,
                Fee = course.Fee, // decimal? nên gán thẳng
                OriginalFee = course.OriginalFee, // decimal? nên gán thẳng
                IsCombo = course.IsCombo,
                BadgeID = course.BadgeID,
                BadgeName = course.Badge?.Name ?? string.Empty,
                BadgeColor = course.Badge?.Color, // string? ok
                ImageUrl = course.ImageUrl,
                Status = course.Status,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Description = course.Description,
                Overview = course.Overview,
                Rating = course.Reviews.Any()
                        ? course.Reviews.Average(r => r.Rating)
                        : 0,

                TotalReviews = course.Enrollments?.Count ?? 0,
                Topics = course.Topics?.Select(t => new TopicDTO
                {
                    TopicID = t.TopicID,
                    TopicName = t.TopicName ?? string.Empty
                }).ToList() ?? new List<TopicDTO>(),
                Enrollments = course.Enrollments?.Select(e => new EnrollmentDTO
                {
                    EnrollmentID = e.EnrollmentID,
                    CoderID = e.CoderID,
                    CoderName = e.Coder?.CoderName ?? string.Empty,
                    EnrolledAt = e.EnrolledAt
                }).ToList() ?? new List<EnrollmentDTO>(),
                Reviews = course.Reviews?.Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewID,
                    CourseID = r.CourseID,
                    CoderID = r.CoderID,
                    CoderName = r.Coder?.CoderName ?? "Unknown",
                    Rating = r.Rating,
                    Content = r.Content,
                    CreatedAt = r.CreatedAt
                }).ToList() ?? new List<ReviewDTO>(),
                Comments = new List<CommentDTO>() // nếu chưa load, giữ như vậy
            };
        }

    }
}
