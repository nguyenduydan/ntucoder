using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;

namespace api.Infrashtructure.Services
{
    public class LessonService
    {
        private readonly LessonRepository _repository;

        public LessonService (LessonRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResponse<LessonDTO>> GetListAsync (QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _repository.GetListAsync(query, sortField, ascending);
        }

        public async Task<LessonDTO> CreateAsync (LessonDTO dto)
        {
            return dto == null ? throw new ArgumentNullException(nameof(dto)) : await _repository.CreateAsync(dto);
        }
        public async Task<LessonDetailDTO> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<LessonDetailDTO> UpdateAsync(int id, LessonDetailDTO dto)
        {
            return dto == null ? throw new ArgumentNullException(nameof(dto)) : await _repository.UpdateAsync(id, dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

    }
}
