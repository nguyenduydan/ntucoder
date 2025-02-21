using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;
using FluentValidation;
using api.Validator;

namespace api.Infrashtructure.Services
{
    public class CoderService : ICoderService
    {
        private readonly ICoderRepo _coderRepo;

        public CoderService(ICoderRepo coderRepo)
        {
            _coderRepo = coderRepo;
        }

        public async Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto)
        {
            // Validate đầu vào theo quy tắc của CreateCoderDTO
            var validator = new CoderValidator();
            var validationResult = await validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            // Kiểm tra trùng lặp email và username
            if (await _coderRepo.CheckEmailExist(dto.CoderEmail!))
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }
            if (await _coderRepo.CheckUserExist(dto.UserName!))
            {
                throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");
            }

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
            // Validate dữ liệu cập nhật với isUpdate = true
            var validator = new CoderValidator(isUpdate: true);
            var validationResult = await validator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            return await _coderRepo.UpdateCoderAsync(id, dto);
        }
    }
}
