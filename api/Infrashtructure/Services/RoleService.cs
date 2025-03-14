using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;

namespace api.Infrashtructure.Services
{
    public class RoleService
    {
        private readonly RoleRepository _roleRepository;

        public RoleService(RoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        public async Task<RoleDTO> CreateRoleAsync(RoleDTO dto)
        {
            // Ví dụ: Kiểm tra nghiệp vụ trước khi tạo Role
            // Nếu cần, có thể kiểm tra xem Role có tồn tại theo tên hay không
            // var existingRole = await _roleRepository.GetRoleByNameAsync(dto.Name);
            // if(existingRole != null)
            //     throw new InvalidOperationException("Role đã tồn tại.");

            return await _roleRepository.CreateRoleAsync(dto);
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            return await _roleRepository.DeleteRoleAsync(id);
        }

        public async Task<PagedResponse<RoleDTO>> GetAllRoleAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _roleRepository.GetAllRoleAsync(query, sortField, ascending);
        }

        public async Task<RoleDTO> UpdateRoleAsync(int id, RoleDTO dto)
        {
            // Có thể thêm các logic validate hoặc nghiệp vụ khác nếu cần
            return await _roleRepository.UpdateRoleAsync(id, dto);
        }
    }
}
