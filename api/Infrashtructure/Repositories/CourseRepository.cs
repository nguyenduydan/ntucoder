using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Services;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using api.Infrastructure.Helpers;
using System.Net;

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
                    CreatorName = c.Creator.CoderName,
                    Status = c.Status,
                    CourseCategoryID = c.CourseCategoryID,
                    CourseCategoryName = c.CourseCategory.Name,
                    Fee = c.Fee,
                    OriginalFee = c.OriginalFee,
                    IsCombo = c.IsCombo,
                    BadgeID = c.BadgeID,
                    ImageUrl = c.ImageUrl,
                    BadgeName = c.Badge != null ? c.Badge.Name : null,
                    BadgeColor = c.Badge.Color
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
                _ => query.OrderBy(c => c.CourseID) 
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
            // Nếu có file Avatar mới thì xử lý upload.
            if (dto.ImageFile != null)
            {
                using (var stream = dto.ImageFile.OpenReadStream())
                {
                    var fileName = $"imgCourse/{dto.CourseID+"_"+dto.CoderID}.jpg"; // Đặt tên file theo ID
                    var bucketName = "ntucoder"; // Tên bucket MinIO

                    // Upload file lên MinIO
                    var fileUrl = await _minioService.UploadFileAsync(stream, fileName, bucketName);
                    dto.ImageUrl = fileUrl;
                }
            }
            var newCourse = new Course
            {
                CourseName = dto.CourseName,
                Description = dto.Description,
                CoderID = dto.CoderID,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Status = dto.Status,
                CourseCategoryID = dto.CourseCategoryID,
                Fee = dto.Fee.Value,
                OriginalFee = dto.OriginalFee,
                DiscountPercent = dto.DiscountPercent,
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
                .Include(c => c.Creator)
                .Include(c => c.CourseCategory)
                .Include(c => c.Badge)
                .Include(c => c.Topics)
                .Include(c => c.Enrollments)
                .FirstOrDefaultAsync(c => c.CourseID == id);

            if (existingCourse == null)
            {
                throw new KeyNotFoundException($"Khóa học với ID {id} không tồn tại.");
            }

            // Cập nhật chỉ khi có dữ liệu mới
            if (!string.IsNullOrEmpty(dto.CourseName)) existingCourse.CourseName = dto.CourseName;
            if (!string.IsNullOrEmpty(dto.Description)) existingCourse.Description = dto.Description;
            existingCourse.Status = dto.Status;
            if (dto.OriginalFee.HasValue) existingCourse.OriginalFee = dto.OriginalFee.Value;
            if (dto.Fee.HasValue) existingCourse.Fee = dto.Fee.Value;
            if (dto.BadgeID.HasValue) existingCourse.BadgeID = dto.BadgeID.Value;
            if (dto.IsCombo) existingCourse.IsCombo = dto.IsCombo;

            existingCourse.UpdatedAt = DateTime.Now; // Cập nhật thời gian chỉnh sửa

            // Xử lý cập nhật danh mục khóa học (CourseCategoryID)
            if (dto.CourseCategoryID != 0)
            {
                var categoryExists = await _context.CourseCategories.AnyAsync(c => c.CourseCategoryID == dto.CourseCategoryID);
                if (!categoryExists) throw new Exception("CourseCategoryID không hợp lệ.");
                existingCourse.CourseCategoryID = dto.CourseCategoryID;
            }

            // Xử lý cập nhật ảnh nếu có
            if (dto.ImageFile != null)
            {
                using (var stream = dto.ImageFile.OpenReadStream())
                {
                    var fileName = $"imgCourse/{existingCourse.CourseID + "_" + existingCourse.CoderID}.jpg";
                    var bucketName = "ntucoder";

                    var fileUrl = await _minioService.UploadFileAsync(stream, fileName, bucketName);
                    existingCourse.ImageUrl = fileUrl;
                }
            }

            // Cập nhật DiscountPercent nếu có thay đổi về Fee hoặc OriginalFee
            if (dto.Fee.HasValue || dto.OriginalFee.HasValue)
            {
                existingCourse.DiscountPercent = existingCourse.OriginalFee > 0
                    ? (int)Math.Round(((existingCourse.OriginalFee.Value - existingCourse.Fee) / existingCourse.OriginalFee.Value) * 100)
                    : 0;
            }

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
                IsCombo = existingCourse.IsCombo,
                BadgeID = existingCourse.BadgeID,
                ImageUrl = existingCourse.ImageUrl,
                Rating = dto.Rating,
                TotalReviews = dto.TotalReviews,
            };
        }




        public async Task<CourseDetailDTO> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses
                  .Include(c => c.Creator)
                  .Include(c => c.CourseCategory)
                  .Include(c => c.Badge)
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
                CreatorName = course.Creator.CoderName,
                Status = course.Status,
                CourseCategoryID = course.CourseCategoryID,
                CourseCategoryName = course.CourseCategory.Name,
                Fee = course.Fee,
                OriginalFee = course.OriginalFee,
                IsCombo = course.IsCombo,
                BadgeID = course.BadgeID,
                BadgeName = course.Badge.Name,
                ImageUrl = course.ImageUrl,
                CreatedAt = course.CreatedAt,
                UpdatedAt = course.UpdatedAt,
                Rating = 0, 
                TotalReviews = 0, 
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
                Comments = new List<CommentDTO>(),
                Reviews = new List<ReviewDTO>() 
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

        public async Task<PagedResponse<CourseDTO>> SearchCourseAsync(string? keyword, int page, int pageSize)
        {
            var query = _context.Courses.AsNoTracking()
                .Include(c => c.CourseCategory)
                .Include(c => c.Creator)
                .Include(c => c.Badge).Select(c => new CourseDTO
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

            query = SearchHelper<CourseDTO>.ApplySearch(query, keyword, a => a.CourseName);

            return await PagedResponse<CourseDTO>.CreateAsync(query, page, pageSize);
        }

    }
}
