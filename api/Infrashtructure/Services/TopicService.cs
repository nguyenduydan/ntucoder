using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;

namespace api.Infrashtructure.Services
{
    public class TopicService
    {
        private readonly TopicRepository _repository;

        public TopicService (TopicRepository repository)
        {
            _repository = repository;
        }

        public async Task<PagedResponse<TopicDTO>> GetListAsync (QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _repository.GetListAsync (query, sortField, ascending);
        }

        public async Task<TopicDTO> CreateAsync(TopicDTO dto)
        {
            return dto == null ? throw new ArgumentNullException (nameof (dto)) : await _repository.CreateAsync (dto);
        }

        public async Task<TopicDetailDTO> GetByIdAsync (int id)
        {
            return await _repository.GetById (id);
        }

        public async Task<TopicDetailDTO> UpdateAsync (int id, TopicDetailDTO dto)
        {
            return dto == null ? throw new ArgumentNullException(nameof(dto)) : await _repository.UpdateAsync(id,dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync (id);
        }
    }
}
