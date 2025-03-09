using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Models;
using api.Models.ERD;

namespace api.Infrashtructure.Repositories
{
    public class RoleRepository
    {
        private readonly ApplicationDbContext _context;
        
        public RoleRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RoleDTO> CreateRoleAsync(RoleDTO dto)
        {
            // Chuyển đổi DTO sang Entity
            var role = new Role
            {
                // RoleID được sinh tự động khi thêm vào CSDL
                Name = dto.Name
            };

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            // Gán lại RoleID đã được sinh cho DTO
            dto.RoleID = role.RoleID;
            return dto;
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                return false;
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<RoleDTO>> GetAllRoleAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var roleQuery = _context.Roles.AsQueryable();

            // Sắp xếp theo trường được cung cấp
            if (!string.IsNullOrEmpty(sortField))
            {
                switch (sortField.ToLower())
                {
                    case "name":
                        roleQuery = ascending ? roleQuery.OrderBy(r => r.Name)
                                              : roleQuery.OrderByDescending(r => r.Name);
                        break;
                    default:
                        roleQuery = ascending ? roleQuery.OrderBy(r => r.RoleID)
                                              : roleQuery.OrderByDescending(r => r.RoleID);
                        break;
                }
            }
            else
            {
                roleQuery = roleQuery.OrderBy(r => r.RoleID);
            }

            // Mapping từ Entity sang DTO
            var roleDTOQuery = roleQuery.Select(r => new RoleDTO
            {
                RoleID = r.RoleID,
                Name = r.Name
            });

            // Sử dụng helper phân trang (PagedResponse<T>)
            var pagedResult = await PagedResponse<RoleDTO>.CreateAsync(
                roleDTOQuery, 
                query.Page, 
                query.PageSize
                );
            return pagedResult;
        }

        public async Task<RoleDTO> UpdateRoleAsync(int id, RoleDTO dto)
        {
            var role = await _context.Roles.FindAsync(id);
            if (role == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy role với id = {id}");
            }

            // Cập nhật thuộc tính (giả sử chỉ có Name cần cập nhật)
            role.Name = dto.Name;

            await _context.SaveChangesAsync();

            return new RoleDTO
            {
                RoleID = role.RoleID,
                Name = role.Name
            };
        }
    }
}
