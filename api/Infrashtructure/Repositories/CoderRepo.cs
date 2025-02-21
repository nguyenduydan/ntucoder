using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using api.Infrashtructure.Services;

namespace api.Infrashtructure.Repositories
{
    public class CoderRepo : ICoderRepo
    {
        private readonly ApplicationDbContext _context;
        private readonly IMinioService _minioService;

        public CoderRepo(ApplicationDbContext context, IMinioService minioService)
        {
            _context = context;
            _minioService = minioService;
        }

        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            // Sử dụng AsNoTracking nếu chỉ đọc để tối ưu hiệu năng
            var coderQuery = _context.Accounts
                .AsNoTracking()
                .Include(a => a.Coder)
                .Select(a => new CoderDTO
                {
                    CoderID = a.Coder.CoderID,
                    UserName = a.UserName,
                    CoderName = a.Coder.CoderName,
                    CoderEmail = a.Coder.CoderEmail,
                    PhoneNumber = a.Coder.PhoneNumber,
                });

            coderQuery = ApplySorting(coderQuery, sortField, ascending);

            var coder = await PagedResponse<CoderDTO>.CreateAsync(
                coderQuery,
                query.Page,
                query.PageSize);

            return coder;
        }

        public IQueryable<CoderDTO> ApplySorting(IQueryable<CoderDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "codername" => ascending ? query.OrderBy(a => a.CoderName) : query.OrderByDescending(a => a.CoderName),
                "username" => ascending ? query.OrderBy(a => a.UserName) : query.OrderByDescending(a => a.UserName),
                _ => query.OrderBy(a => a.CoderID)
            };
        }

        public async Task<CoderDetailDTO> GetCoderByIdAsync(int id)
        {
            var coder = await _context.Coders
                        .AsNoTracking()
                        .Include(c => c.Account)
                        .FirstOrDefaultAsync(c => c.CoderID == id);
            if (coder == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy coder với id = {id}.");
            }

            return new CoderDetailDTO
            {
                CoderID = coder.CoderID,
                UserName = coder.Account.UserName,
                CoderName = coder.CoderName,
                CoderEmail = coder.CoderEmail,
                PhoneNumber = coder.PhoneNumber,
                Avatar = coder.Avatar,
                Description = coder.Description,
                Gender = coder.Gender,
                CreatedAt = coder.CreatedAt,
                CreatedBy = coder.CreatedBy,
                UpdatedAt = coder.UpdatedAt,
                UpdatedBy = coder.UpdatedBy
            };
        }

        // Hàm băm mật khẩu – không thay đổi
        public static string HashPassword(string password, string salt)
        {
            var combined = password + salt;
            using (var sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(combined));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        /// <summary>
        /// Tạo mới Coder.
        /// Lưu ý: Các bước validate đầu vào và kiểm tra trùng lặp (email, username) nên được thực hiện trong tầng Service.
        /// </summary>
        public async Task<CreateCoderDTO> CreateCoderAsync(CreateCoderDTO dto)
        {
            // Tạo salt và băm mật khẩu
            var salt = PasswordHelper.GenerateSalt();
            var hashedPassword = HashPassword(dto.Password!, salt);

            // Khởi tạo đối tượng Coder
            var coder = new Coder
            {
                CoderName = dto.CoderName!,
                CoderEmail = dto.CoderEmail!,
                PhoneNumber = dto.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "admin",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "admin"
            };

            // Giả sử Account có navigation property Coder (one-to-one)
            var account = new Account
            {
                UserName = dto.UserName!,
                Password = hashedPassword,
                SaltMD5 = salt,
                RoleID = 2,
                Coder = coder
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync(); // Lưu đồng thời cả Account và Coder

            dto.CoderID = account.AccountID; // Giả sử AccountID được dùng làm khóa chính chung
            return dto;
        }

        /// <summary>
        /// Cập nhật thông tin coder.
        /// Chỉ thực hiện thao tác lưu dữ liệu. Các bước validate đầu vào và xử lý file (nếu cần)
        /// có thể được xử lý bên tầng Service trước khi gọi repository.
        /// </summary>
        public async Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto)
        {
            var existing = await _context.Coders.FindAsync(id);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy coder với id = {id}.");
            }

            // Giả sử các kiểm tra đầu vào đã được thực hiện từ tầng Service.
            existing.CoderName = dto.CoderName ?? existing.CoderName;
            existing.Description = dto.Description ?? existing.Description;
            if (dto.Gender.HasValue)
                existing.Gender = dto.Gender.Value;
            existing.PhoneNumber = dto.PhoneNumber ?? existing.PhoneNumber;

            // Nếu có file Avatar mới thì xử lý upload.
            if (dto.AvatarFile != null)
            {
                using (var stream = dto.AvatarFile.OpenReadStream())
                {
                    var fileName = $"avatars/{existing.CoderID}.jpg"; // Đặt tên file theo ID
                    var bucketName = "ntucoder"; // Tên bucket MinIO

                    // Upload file lên MinIO
                    var fileUrl = await _minioService.UploadFileAsync(stream, fileName, bucketName);
                    existing.Avatar = fileUrl;
                }
            }

            existing.UpdatedAt = DateTime.UtcNow;
            existing.UpdatedBy = "admin";

            await _context.SaveChangesAsync();

            return new CoderDetailDTO
            {
                CoderID = existing.CoderID,
                CoderName = existing.CoderName,
                Avatar = existing.Avatar,
                Description = existing.Description,
                Gender = existing.Gender,
                PhoneNumber = existing.PhoneNumber,
                UpdatedAt = existing.UpdatedAt,
                UpdatedBy = existing.UpdatedBy
            };
        }

        /// <summary>
        /// Xóa coder và tài khoản liên quan.
        /// </summary>
        public async Task<bool> DeleteCoderAsync(int id)
        {
            var coder = await _context.Coders
                .Include(c => c.Account)
                .FirstOrDefaultAsync(c => c.CoderID == id);
            if (coder == null)
            {
                return false;
            }

            _context.Coders.Remove(coder);
            if (coder.Account != null)
            {
                _context.Accounts.Remove(coder.Account);
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckEmailExist(string email)
        {
            return await _context.Coders.AnyAsync(c => c.CoderEmail == email);
        }

        public async Task<bool> CheckUserExist(string username)
        {
            return await _context.Accounts.AnyAsync(c => c.UserName == username);
        }
    }
}
