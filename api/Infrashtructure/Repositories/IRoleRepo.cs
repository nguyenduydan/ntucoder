using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;

namespace api.Infrashtructure.Repositories
{
    public interface IRoleRepo
    {
        Task<PagedResponse<RoleDTO>> GetAllRoleAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<RoleDTO> CreateRoleAsync(RoleDTO dto);
        Task<RoleDTO> UpdateRoleAsync(int id, RoleDTO dto);
        Task<bool> DeleteRoleAsync(int id);
    }
}
