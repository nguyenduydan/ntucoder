using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class CourseCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CourseCategoryRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<CourseCategoryDTO>> GetAllAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            // Tạo truy vấn IQueryable để áp dụng LINQ trước khi lấy dữ liệu
            var queryData = _context.CourseCategories
                .AsNoTracking()
                .Include(cc => cc.Courses)
                .Select(cc => new CourseCategoryDTO
                {
                    CourseCategoryID = cc.CourseCategoryID,
                    Name = cc.Name,
                    Order = cc.Order,
                    CourseIDs = cc.Courses.Select(c => c.CourseID).ToList()
                });

            queryData = ApplySorting(queryData, sortField, ascending);

            var CourseCategories = await PagedResponse<CourseCategoryDTO>.CreateAsync(
                queryData,
                query.Page,
                query.PageSize
            );

            return CourseCategories;
        }


        public IQueryable<CourseCategoryDTO> ApplySorting(IQueryable<CourseCategoryDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "name" => ascending ? query.OrderBy(cc => cc.Name) : query.OrderByDescending(cc => cc.Name),
                _ => query.OrderBy(cc => cc.CourseCategoryID)
            };
        }

        public async Task<CourseCategoryDTO> CreateCategoryAsync(CourseCategoryDTO dto)
        {
            // Kiểm tra xem danh mục đã tồn tại hay chưa
            var existingCategory = await _context.CourseCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Name == dto.Name);

            if (existingCategory != null)
            {
                throw new InvalidOperationException("Tên danh mục đã tồn tại.");
            }

            // Tạo danh mục mới
            var newCategory = new CourseCategory
            {
                Name = dto.Name,
                Order = dto.Order
            };

            _context.CourseCategories.Add(newCategory);
            await _context.SaveChangesAsync();

            // Trả về DTO mới
            return new CourseCategoryDTO
            {
                CourseCategoryID = newCategory.CourseCategoryID,
                Name = newCategory.Name,
                Order = newCategory.Order
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var courseCategory = await _context.CourseCategories.FindAsync(id);

            if (courseCategory == null)
                return false;

            _context.CourseCategories.Remove(courseCategory);
            await _context.SaveChangesAsync();

            return true;
        }

    }
}
