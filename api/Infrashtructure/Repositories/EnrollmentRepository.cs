using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class EnrollmentRepository
    {
        private readonly ApplicationDbContext _context;

        public EnrollmentRepository(ApplicationDbContext context)
        {
            _context = context; 
        }

        public async Task<PagedResponse<EnrollmentDTO>> GetListAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryData = _context.Enrollments
                .AsNoTracking()
                .Include(e => e.Coder)
                .Include(e => e.Course)
                .Select(e => new EnrollmentDTO
                {
                    CoderID = e.CoderID,
                    CourseID = e.CourseID,
                    EnrolledAt = e.EnrolledAt,
                });

            queryData = ApplySorting(queryData, sortField, ascending);
            var enrollment = await PagedResponse<EnrollmentDTO>.CreateAsync(
                queryData,
                query.Page,
                query.PageSize
                );
            return enrollment;
        }
        public IQueryable<EnrollmentDTO> ApplySorting(IQueryable<EnrollmentDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "EnrolledAt" => ascending ? query.OrderBy(c => c.EnrolledAt) : query.OrderByDescending(c => c.EnrolledAt),
                _ => query.OrderBy(c => c.CourseID)
            };
        }

        public async Task<EnrollmentDTO> CreateAsync(EnrollmentDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // ✅ Kiểm tra Coder và Course có tồn tại không
            var coderExists = await _context.Coders.AnyAsync(c => c.CoderID == dto.CoderID);
            if (!coderExists)
                throw new ArgumentException("Mã coder không hợp lệ hoặc không tồn tại.");

            var courseExists = await _context.Courses.AnyAsync(c => c.CourseID == dto.CourseID);
            if (!courseExists)
                throw new ArgumentException("Mã khóa học không hợp lệ hoặc không tồn tại.");

            // ✅ Kiểm tra trùng lặp đăng ký
            var alreadyEnrolled = await _context.Enrollments
                .AnyAsync(e => e.CoderID == dto.CoderID && e.CourseID == dto.CourseID);

            if (await CheckCoderEnrolledAsync(dto.CoderID, dto.CourseID))
                throw new InvalidOperationException("Coder này đã đăng ký khóa học này.");

            // ✅ Nếu mọi thứ hợp lệ → thêm mới
            var enrollment = new Enrollment
            {
                CourseID = dto.CourseID,
                CoderID = dto.CoderID,
                EnrolledAt = DateTime.Now,
            };

            await _context.Enrollments.AddAsync(enrollment);
            await _context.SaveChangesAsync();

            dto.EnrollmentID = enrollment.EnrollmentID;
            dto.EnrolledAt = enrollment.EnrolledAt; // cập nhật lại cho DTO

            return dto;
        }

        public async Task<EnrollmentDTO?> GetByIdAsync(int id)
        {
            return await _context.Enrollments
                .AsNoTracking()
                .Where(e => e.EnrollmentID == id)
                .Select(e => new EnrollmentDTO
                {
                    EnrollmentID = e.EnrollmentID,
                    CourseID = e.CourseID,
                    CoderID = e.CoderID,
                    EnrolledAt = e.EnrolledAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<EnrollmentDTO> UpdateAsync(EnrollmentDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            var enrollment = await _context.Enrollments.FindAsync(dto.EnrollmentID);

            if (enrollment == null)
                throw new KeyNotFoundException($"Không tìm thấy bản ghi Enrollment với ID = {dto.EnrollmentID}.");

            // Kiểm tra CoderID và CourseID có hợp lệ không
            var coderExists = await _context.Coders.AnyAsync(c => c.CoderID == dto.CoderID);
            if (!coderExists)
                throw new ArgumentException("CoderID không hợp lệ.");

            var courseExists = await _context.Courses.AnyAsync(c => c.CourseID == dto.CourseID);
            if (!courseExists)
                throw new ArgumentException("CourseID không hợp lệ.");

            if (enrollment.CoderID != dto.CoderID || enrollment.CourseID != dto.CourseID)
            {
                bool checkEnrolled = await CheckCoderEnrolledAsync(dto.CoderID, dto.CourseID);
                if (checkEnrolled)
                    throw new InvalidOperationException("Coder này đã đăng ký khóa học này.");
            }


            // Cập nhật dữ liệu
            enrollment.CoderID = dto.CoderID;
            enrollment.CourseID = dto.CourseID;
            enrollment.EnrolledAt = DateTime.Now; // hoặc DateTime.Now nếu muốn cập nhật thời gian mới

            _context.Enrollments.Update(enrollment);
            await _context.SaveChangesAsync();

            return dto;
        }

        public async Task<List<EnrollmentDTO>> GetEnrollmentsByCoderID(int coderID)
        {
            var coderExists = await _context.Coders.AnyAsync(c => c.CoderID == coderID);
            if (!coderExists)
                throw new KeyNotFoundException($"Không tìm thấy coder với ID = {coderID}.");

            var enrollments = await _context.Enrollments
                .AsNoTracking()
                .Include(e => e.Course)
                .Where(e => e.CoderID == coderID)
                .Select(e => new EnrollmentDTO
                {
                    EnrollmentID = e.EnrollmentID,
                    CourseID = e.CourseID,
                    CoderID = e.CoderID,
                    EnrolledAt = e.EnrolledAt
                })
                .ToListAsync();

            return enrollments;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var enrollment = await _context.Enrollments.FindAsync(id);

            if (enrollment == null)
                throw new KeyNotFoundException($"Không tìm thấy bản ghi Enrollment với ID = {id}.");

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteByCourseAndCoderAsync(int courseID, int coderID)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.CourseID == courseID && e.CoderID == coderID);

            if (enrollment == null)
                throw new KeyNotFoundException("Không tìm thấy bản ghi đăng ký khóa học.");

            _context.Enrollments.Remove(enrollment);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> CheckCoderEnrolledAsync(int coderId, int courseId)
        {
            return await _context.Enrollments
                .AnyAsync(e => e.CoderID == coderId
                            && e.CourseID == courseId);
        }


    }

}
