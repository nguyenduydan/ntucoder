using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;

namespace api.Services
{
    public class CourseCategoryService
    {
        private readonly CourseCategoryRepository _repository;

        public CourseCategoryService(CourseCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResponse<CourseCategoryDTO>> GetAllCategoriesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _repository.GetAllAsync(query, sortField, ascending);
        }

        public async Task<CourseCategoryDTO> CreateCategoryAsync(CourseCategoryDTO dto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new ArgumentException("Tên danh mục không được để trống.");
            }

            return await _repository.CreateCategoryAsync(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
