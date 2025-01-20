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
        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
           return await _coderRepo.GetAllCoderAsync(query, sortField, ascending);
        }
    }
}
