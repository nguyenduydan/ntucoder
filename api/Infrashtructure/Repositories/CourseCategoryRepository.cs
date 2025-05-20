using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using api.Infrastructure.Helpers;

namespace api.Infrashtructure.Repositories
{
    public class CourseCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CourseCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Trả về danh sách phân trang CourseCategoryDTO với tùy chọn sắp xếp
        public async Task<PagedResponse<CourseCategoryDTO>> GetAllAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryable = GetQueryable();

            queryable = ApplySorting(queryable, sortField, ascending);

            return await PagedResponse<CourseCategoryDTO>.CreateAsync(queryable, query.Page, query.PageSize);
        }

       
        // Áp dụng sắp xếp theo trường và chiều (tăng/giảm)
        public IQueryable<CourseCategoryDTO> ApplySorting(IQueryable<CourseCategoryDTO> query, string? sortField, bool ascending)
        {
            if (string.IsNullOrWhiteSpace(sortField))
                return query.OrderBy(cc => cc.CourseCategoryID);

            return sortField.ToLower() switch
            {
                "name" => ascending ? query.OrderBy(cc => cc.Name) : query.OrderByDescending(cc => cc.Name),
                "order" => ascending ? query.OrderBy(cc => cc.Order) : query.OrderByDescending(cc => cc.Order),
                _ => query.OrderBy(cc => cc.CourseCategoryID)
            };
        }

        // Tạo mới danh mục khóa học từ DTO, trả về DTO mới tạo
        public async Task<CourseCategoryDTO> CreateCategoryAsync(CourseCategoryDTO dto)
        {
            if (await _context.CourseCategories.AnyAsync(c => c.Name == dto.Name))
                throw new InvalidOperationException("Tên danh mục đã tồn tại.");

            var entity = new CourseCategory
            {
                Name = dto.Name,
                Order = dto.Order
            };

            _context.CourseCategories.Add(entity);
            await _context.SaveChangesAsync();

            return MapDto(entity);
        }

        // Xóa danh mục theo id, trả về true nếu thành công
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.CourseCategories.FindAsync(id);
            if (entity == null) return false;

            _context.CourseCategories.Remove(entity);
            await _context.SaveChangesAsync();

            return true;
        }

        // Tìm kiếm khóa học theo keyword (dành cho Course)
        public async Task<PagedResponse<CourseCategoryDTO>> SearchAsync(string? keyword, int page, int pageSize)
        {
            var queryData = GetQueryable();

            queryData = SearchHelper<CourseCategoryDTO>.ApplySearchMultiField(queryData, keyword, useAnd: true,
                c => c.Name
            );

            return await PagedResponse<CourseCategoryDTO>.CreateAsync(queryData, page, pageSize);
        }

        // Lấy IQueryable<CourseCategoryDTO> từ db context, map dữ liệu
        private IQueryable<CourseCategoryDTO> GetQueryable()
        {
            return _context.CourseCategories
                .AsNoTracking()
                .Include(cc => cc.Courses)
                .Select(cc => new CourseCategoryDTO
                {
                    CourseCategoryID = cc.CourseCategoryID,
                    Name = cc.Name,
                    Order = cc.Order,
                    CourseIDs = cc.Courses.Select(c => c.CourseID).ToList()
                });
        }

        // Map entity sang DTO
        private CourseCategoryDTO MapDto(CourseCategory entity)
        {
            return new CourseCategoryDTO
            {
                CourseCategoryID = entity.CourseCategoryID,
                Name = entity.Name,
                Order = entity.Order,
                CourseIDs = entity.Courses?.Select(c => c.CourseID).ToList() ?? new List<int>()
            };
        }
    }
}
