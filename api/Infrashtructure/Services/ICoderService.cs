using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;

namespace api.Infrashtructure.Services
{
    public interface ICoderService
    {
        Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<CoderDetailDTO> GetCoderByIdAsync(int id);
        Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto);
        Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto);
        Task<bool> DeleteCoderAsync(int id);
    }
}
