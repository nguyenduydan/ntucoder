using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;

namespace api.Infrashtructure.Repositories
{
    public interface ICoderRepo
    {
        Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true);
    }
}
