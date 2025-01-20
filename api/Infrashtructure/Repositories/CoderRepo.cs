using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class CoderRepo : ICoderRepo
    {
        private readonly ApplicationDbContext _context;

        public CoderRepo(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var coderQuery = _context.Accounts
                .Include(a => a.Coder)
                .Select(a => new CoderDTO
                {
                    CoderID = a.Coder.CoderID,
                    UserName = a.UserName,
                    CoderName = a.Coder.CoderName,
                    CoderEmail = a.Coder.CoderEmail,
                    PhoneNumber = a.Coder.PhoneNumber,
                });
            coderQuery = ApplySorting(coderQuery, sortField, ascending);
            var coder = await PagedResponse<CoderDTO>.CreateAsync(
                coderQuery,
                query.Page,
                query.PageSize);
            return coder;
        }
        public IQueryable<CoderDTO> ApplySorting(IQueryable<CoderDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "codername" => ascending ? query.OrderBy(a => a.UserName) : query.OrderByDescending(a => a.UserName),
                _ => query.OrderBy(a => a.CoderID)
            };
        }
    }

}
