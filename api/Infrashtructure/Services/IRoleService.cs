using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;

namespace api.Infrashtructure.Services
{
    public interface IRoleService
    {
        Task<RoleDTO> CreateRoleAsync(RoleDTO dto);
        Task<bool> DeleteRoleAsync(int id);
        Task<PagedResponse<RoleDTO>> GetAllRoleAsync(QueryObject query, string? sortField = null, bool ascending = true);
        Task<RoleDTO> UpdateRoleAsync(int id, RoleDTO dto);
    }
}
