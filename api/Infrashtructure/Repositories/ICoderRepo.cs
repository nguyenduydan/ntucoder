using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;

namespace api.Infrashtructure.Repositories
{
    public interface ICoderRepo
    {
        Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<CoderDetailDTO> GetCoderByIdAsync(int id);
        Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto);
        Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto);
        Task<bool> DeleteCoderAsync(int id);

        //Checking
        Task<bool> CheckEmailExist (string email);
        Task<bool> CheckUserExist(string username);

    }
}
