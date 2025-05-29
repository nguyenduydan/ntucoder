using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Services;
using api.Infrastructure.Helpers;
using api.Models.ERD;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Security.Cryptography;

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
                using Stream stream = dto.ImageFile.OpenReadStream();
                // Sinh tên file mã hóa bằng SHA256
                string raw = $"{dto.CourseID}_{dto.CoderID}_{DateTime.UtcNow.Ticks}";
                using SHA256 sha256 = SHA256.Create();
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(raw));
                string hash = BitConverter.ToString(bytes).Replace("-", "").ToLower();

                // Lấy extension gốc, nếu có
                string ext = Path.GetExtension(dto.ImageFile.FileName);
                if (string.IsNullOrEmpty(ext)) ext = ".jpg";

                string fileName = $"imgCourse/{hash}{ext}";
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
                using Stream stream = dto.ImageFile.OpenReadStream();
                // Sinh tên file mã hóa bằng SHA256
                string raw = $"{dto.CourseID}_{dto.CoderID}_{DateTime.UtcNow.Ticks}";
                using SHA256 sha256 = SHA256.Create();
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(raw));
                string hash = BitConverter.ToString(bytes).Replace("-", "").ToLower();

                // Lấy extension gốc, nếu có
                string ext = Path.GetExtension(dto.ImageFile.FileName);
                if (string.IsNullOrEmpty(ext)) ext = ".jpg";

                string fileName = $"imgCourse/{hash}{ext}";
                dto.ImageUrl = await _minioService.UploadFileAsync(stream, fileName, "ntucoder");
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
            var dto = await _context.Courses
                .Where(c => c.CourseID == id)
                .Select(c => new CourseDetailDTO
                {
                    CourseID = c.CourseID,
                    CourseName = c.CourseName ?? string.Empty,
                    CoderID = c.CoderID,
                    CreatorName = c.Creator.CoderName ?? string.Empty,
                    CourseCategoryID = c.CourseCategoryID,
                    CourseCategoryName = c.CourseCategory.Name ?? string.Empty,
                    Fee = c.Fee,
                    OriginalFee = c.OriginalFee,
                    IsCombo = c.IsCombo,
                    BadgeID = c.BadgeID,
                    BadgeName = c.Badge.Name ?? string.Empty,
                    BadgeColor = c.Badge.Color,
                    ImageUrl = c.ImageUrl,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    Description = c.Description,
                    Overview = c.Overview,
                    Topics = c.Topics.Select(t => new TopicDTO
                    {
                        TopicID = t.TopicID,
                        TopicName = t.TopicName ?? string.Empty
                    }).ToList(),
                    EnrollCount = _context.Enrollments.Count(e => e.CourseID == c.CourseID),
                    Rating = _context.Reviews
                        .Where(r => r.CourseID == c.CourseID)
                        .Select(r => (double?)r.Rating)
                        .Average() ?? 0
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (dto == null)
                throw new KeyNotFoundException($"Khóa học với ID {id} không tồn tại.");

            return dto;
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

            // Sửa: Thống kê review theo CourseID (đúng logic trung bình rating từng khóa học)
            var reviewStatsByCourse = _context.Reviews
                .GroupBy(r => r.CourseID)
                .Select(g => new
                {
                    CourseID = g.Key,
                    AvgRating = g.Average(r => r.Rating),
                    TotalReviews = g.Count()
                });

            var query = _context.Courses
                .Include(c => c.Creator)
                .Include(c => c.CourseCategory)
                .Include(c => c.Badge)
                .Include(c => c.Reviews)
                .AsNoTracking()
                .GroupJoin(enrollCounts,
                    c => c.CourseID,
                    ec => ec.CourseID,
                    (c, ec) => new { c, ec })
                .SelectMany(
                    temp => temp.ec.DefaultIfEmpty(),
                    (temp, ec) => new { temp.c, EnrollCount = ec != null ? (int?)ec.Count : null })
                // Sửa: Join theo CourseID với reviewStatsByCourse
                .GroupJoin(reviewStatsByCourse,
                    temp => temp.c.CourseID,
                    rs => rs.CourseID,
                    (temp, rs) => new { temp.c, temp.EnrollCount, rs })
                .SelectMany(
                    temp => temp.rs.DefaultIfEmpty(),
                    (temp, rs) => new
                    {
                        temp.c,
                        temp.EnrollCount,
                        AvgRating = rs != null ? (double?)rs.AvgRating : null,
                        TotalReviews = rs != null ? (int?)rs.TotalReviews : null
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
                    Rating = x.AvgRating ?? 0,
                    TotalReviews = x.TotalReviews ?? 0,
                    EnrollCount = ((int?)x.EnrollCount).GetValueOrDefault(),
                    CreatedAt = x.c.CreatedAt,
                    UpdatedAt = x.c.UpdatedAt,
                });

            return query;
        }

        //private CourseDTO MapToCourseDto(Course course, int enrollmentCount = 0, double? rating = null)
        //{
        //    return new CourseDTO
        //    {
        //        CourseID = course.CourseID,
        //        CourseName = course.CourseName,
        //        CoderID = course.CoderID,
        //        CreatorName = course.Creator?.CoderName ?? string.Empty,
        //        CourseCategoryID = course.CourseCategoryID,
        //        CourseCategoryName = course.CourseCategory?.Name ?? string.Empty,
        //        Fee = course.Fee,
        //        OriginalFee = course.OriginalFee,
        //        IsCombo = course.IsCombo,
        //        BadgeID = course.BadgeID,
        //        BadgeName = course.Badge?.Name ?? string.Empty,
        //        BadgeColor = course.Badge?.Color,
        //        ImageUrl = course.ImageUrl,
        //        Status = course.Status,
        //        Rating = rating ?? 0,
        //        TotalReviews = enrollmentCount
        //    };
        //}

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

                Topics = course.Topics?.Select(t => new TopicDTO
                {
                    TopicID = t.TopicID,
                    TopicName = t.TopicName ?? string.Empty
                }).ToList() ?? new List<TopicDTO>(),

                Enrollments = new List<EnrollmentDTO>(), // bỏ chi tiết
                Reviews = new List<ReviewDTO>(),          // defer load nếu cần
                Comments = new List<CommentDTO>()         // defer load nếu cần
            };
        }
    }
}
