using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using api.Infrashtructure.Services;

namespace api.Infrashtructure.Repositories
{
    public class CoderRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly MinioService _minioService;

        public CoderRepository(ApplicationDbContext context, MinioService minioService)
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
                    Role = a.RoleID,
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
                        .Include(m => m.Matchs)  // Đảm bảo bao gồm tất cả các Match
                        .FirstOrDefaultAsync(c => c.CoderID == id);

            if (coder == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy coder với id = {id}.");
            }

            // Tính tổng điểm của coder từ tất cả các match
           var totalPoints = coder.Matchs.Sum(m => m.Point);

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
                UpdatedBy = coder.UpdatedBy,
                Role = coder.Account.RoleID,
                TotalPoint = totalPoints, 
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
            if(await CheckEmailExist(dto.CoderEmail!))
            {
                throw new InvalidOperationException("Email đã tồn tại.");
            }

            if (await CheckUserExist(dto.UserName!))
            {
                throw new InvalidOperationException("Tên đăng nhập đã tồn tại.");
            }
            var salt = PasswordHelper.GenerateSalt();
            var hashedPassword = HashPassword(dto.Password!, salt);
            var account = new Account
            {
                UserName = dto.UserName!,
                Password = hashedPassword,
                SaltMD5 = salt,
                RoleID = dto.Role,
            };

            _context.Accounts.Add(account);
            await _context.SaveChangesAsync();

            var coder = new Coder
            {
                CoderID = account.AccountID,
                CoderName = dto.CoderName!,
                CoderEmail = dto.CoderEmail!,
                PhoneNumber = dto.PhoneNumber,
                Gender = Enums.GenderEnum.other,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "admin",
                UpdatedAt = DateTime.UtcNow,
                UpdatedBy = "admin",
            };

            _context.Coders.Add(coder);
            await _context.SaveChangesAsync();
            dto.CoderID = coder.CoderID;
            return dto;
        }

        /// <summary>
        /// Cập nhật thông tin coder.
        /// Chỉ thực hiện thao tác lưu dữ liệu. Các bước validate đầu vào và xử lý file (nếu cần)
        /// có thể được xử lý bên tầng Service trước khi gọi repository.
        /// </summary>
        public async Task<CoderDetailDTO> UpdateCoderAsync(int id, CoderDetailDTO dto)
        {
            var existing = await _context.Coders
                                  .Include(c => c.Account) 
                                  .FirstOrDefaultAsync(c => c.CoderID == id);
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

            existing.UpdatedAt = DateTime.Now;
            existing.UpdatedBy = dto.CoderName;
            if (existing.Account != null && dto.Role != null)
            {
                existing.Account.RoleID = dto.Role;
            }
            else if (existing.Account == null)
            {
                // Xử lý trường hợp nếu Account không tồn tại (có thể tạo mới hoặc báo lỗi)
                throw new KeyNotFoundException("Không tìm thấy tài khoản của coder này.");
            }


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
