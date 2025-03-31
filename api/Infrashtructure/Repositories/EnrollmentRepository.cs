using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models;
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

    }
}
