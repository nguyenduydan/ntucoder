using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;

namespace api.Infrashtructure.Services
{
    public interface ICoderService
    {
        Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true);
    }
}
