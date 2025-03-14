using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class BadgeRepository
    {
        private readonly ApplicationDbContext _context;

        public BadgeRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<BadgeDTO>> GetAllBadgeAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryData = _context.Badges
                .AsNoTracking()
                .Include(b => b.Courses)
                .Select(b => new BadgeDTO
                {
                    BadgeID = b.BadgeID,
                    Name = b.Name,
                    Description = b.Description,
                    Color = b.Color,
                });
            queryData = ApplySorting(queryData, sortField, ascending);

            var badge = await PagedResponse<BadgeDTO>.CreateAsync(
                queryData,
                query.Page,
                query.PageSize
                );
            return badge;
        }

        public IQueryable<BadgeDTO> ApplySorting(IQueryable<BadgeDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "name" => ascending ? query.OrderBy(b => b.Name) : query.OrderByDescending(b => b.Name),
                _ => query.OrderBy(b => b.BadgeID)
            };
        }

        public async Task<BadgeDTO> CreateBadgeAsync(BadgeDTO dto)
        {
            var existingBadge = await _context.Badges
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.Name == dto.Name);

            if (existingBadge != null)
            {
                throw new InvalidOperationException("Tên huy hiệu đã tồn tại.");
            }

            var newBadge = new Badge
            {
                Name = dto.Name, 
                Description = dto.Description,
                Color = dto.Color,
            };

            _context.Badges.Add(newBadge);
            await _context.SaveChangesAsync();

            return dto;
        }

        public async Task<bool> DeleteBadgeAsync(int id)
        {
            var badge = await _context.Badges.FindAsync(id); 

            if (badge == null)
                return false; 

            _context.Badges.Remove(badge); 
            await _context.SaveChangesAsync(); 

            return true;
        }


    }
}
