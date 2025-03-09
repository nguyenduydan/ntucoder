using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;

namespace api.Infrashtructure.Services
{
    public class BadgeService
    {
        private readonly BadgeRepository _badgeRepository;

        public BadgeService (BadgeRepository badgeRepository)
        {
            _badgeRepository = badgeRepository;
        }

        public async Task<BadgeDTO> CreateBadgeAsync(BadgeDTO badgeDTO)
        {
            if (string.IsNullOrWhiteSpace(badgeDTO.Name)) {
                throw new ArgumentException("Tên huy hiệu không được để trống.");
            }
            return await _badgeRepository.CreateBadgeAsync(badgeDTO);
        }

        public async Task<PagedResponse<BadgeDTO>> GetAllBadgeAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _badgeRepository.GetAllBadgeAsync(query, sortField, ascending);
        }

        public async Task<bool> DeleteBadgeAsync(int id)
        {
            return await _badgeRepository.DeleteBadgeAsync(id);
        }
    }
}
