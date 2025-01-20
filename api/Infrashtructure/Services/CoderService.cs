using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;

namespace api.Infrashtructure.Services
{
    public class CoderService : ICoderService
    {
        private readonly ICoderRepo _coderRepo;

        public CoderService (ICoderRepo coderRepo)
        {
            _coderRepo = coderRepo;
        }

        public async Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto)
        {
            return await _coderRepo.CreateCoderAsync(dto);
        }

        public async Task<bool> DeleteCoderAsync(int id)
        {
           return await _coderRepo.DeleteCoderAsync(id);
        }

        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
           return await _coderRepo.GetAllCoderAsync(query, sortField, ascending);
        }

        public async Task<CoderDetailDTO> GetCoderByIdAsync(int id)
        {
           return await _coderRepo.GetCoderByIdAsync(id);
        }

        public async Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto)
        {
           return await _coderRepo.UpdateCoderAsync(id, dto);  
        }
    }
}
