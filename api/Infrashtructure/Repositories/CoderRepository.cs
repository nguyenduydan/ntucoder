using api.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using api.Infrashtructure.Services;
using Microsoft.Extensions.Caching.Memory;
using api.Infrastructure.Helpers;

namespace api.Infrashtructure.Repositories
{
    public class CoderRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly MinioService _minioService;

        public CoderRepository(ApplicationDbContext context, MinioService minioService, IMemoryCache cache)
        {
            _context = context;
            _minioService = minioService;
        }

        public async Task<PagedResponse<CoderDTO>> GetAllCoderAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            // Sử dụng AsNoTracking nếu chỉ đọc để tối ưu hiệu năng
            var coderQuery = _context.Coders
                .AsNoTracking()
                .AsSplitQuery()
                .Include(a => a.Account)
                    .ThenInclude(a => a.Role)
                .Select(a => new CoderDTO
                {
                    CoderID = a.CoderID,
                    UserName = a.Account.UserName,
                    CoderName = a.CoderName,
                    CoderEmail = a.CoderEmail,
                    PhoneNumber = a.PhoneNumber,
                    Role = a.Account.RoleID,
                    RoleName = a.Account.Role.Name,
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

        //Lấy thông tin bằng id
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
                BirthDay = coder.BirthDay,
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
                ReceiveEmail = dto.CoderEmail,
                SaltMD5 = salt,
                RoleID = dto.Role ?? 1,
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

            // Cập nhật nếu khác null hoặc chuỗi rỗng
            if (!string.IsNullOrWhiteSpace(dto.CoderName))
            {
                existing.CoderName = dto.CoderName;
                existing.UpdatedBy = dto.CoderName; // Cập nhật người chỉnh sửa nếu có tên mới
            }

            if (!string.IsNullOrWhiteSpace(dto.Description))
            {
                existing.Description = dto.Description;
            }

            if (dto.Gender.HasValue)
            {
                existing.Gender = dto.Gender.Value;
            }

            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                existing.PhoneNumber = dto.PhoneNumber;
            }

            if (dto.BirthDay != null)
            {
                existing.BirthDay = dto.BirthDay;
            }

            if (dto.AvatarFile != null)
            {
                using (var stream = dto.AvatarFile.OpenReadStream())
                {
                    var fileName = $"avatars/{existing.CoderID}.jpg"; // Đặt tên file theo ID
                    var bucketName = "ntucoder"; // Tên bucket MinIO

                    var fileUrl = await _minioService.UploadFileAsync(stream, fileName, bucketName);
                    existing.Avatar = fileUrl;
                }
            }

            if (dto.Role.HasValue && dto.Role.Value != 0)
            {
                var roleExists = await _context.Roles.AnyAsync(r => r.RoleID == dto.Role.Value);
                if (!roleExists)
                {
                    throw new InvalidOperationException("Role không tồn tại.");
                }

                if (existing.Account != null)
                {
                    existing.Account.RoleID = dto.Role.Value;
                }
                else
                {
                    throw new KeyNotFoundException("Không tìm thấy tài khoản của coder này.");
                }
            }


            existing.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return new CoderDetailDTO
            {
                CoderID = existing.CoderID,
                CoderName = existing.CoderName,
                Avatar = existing.Avatar,
                Description = existing.Description,
                Gender = existing.Gender,
                PhoneNumber = existing.PhoneNumber,
                BirthDay = existing.BirthDay,
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

        public async Task<List<CoderDetailDTO>> GetTop3HighestAsync()
        {
            var coders = await _context.Coders
                .AsNoTracking()
                .Include(c => c.Account)
                .Include(c => c.Matchs)
                .ToListAsync();

            var coderDTOs = coders
                .Select(c => new CoderDetailDTO
                {
                    CoderID = c.CoderID,
                    UserName = c.Account.UserName,
                    CoderName = c.CoderName,
                    CoderEmail = c.CoderEmail,
                    PhoneNumber = c.PhoneNumber,
                    Avatar = c.Avatar,
                    Description = c.Description,
                    Gender = c.Gender,
                    BirthDay = c.BirthDay,
                    CreatedAt = c.CreatedAt,
                    CreatedBy = c.CreatedBy,
                    UpdatedAt = c.UpdatedAt,
                    UpdatedBy = c.UpdatedBy,
                    Role = c.Account.RoleID,
                    TotalPoint = c.Matchs.Sum(m => m.Point)
                })
                .OrderByDescending(c => c.TotalPoint)
                .Take(3)
                .ToList();

            return coderDTOs;
        }

        public async Task<PagedResponse<CoderDetailDTO>> GetListCoderRakingAsync(QueryObject query, string search)
        {
            var coderQuery = _context.Accounts
                .AsNoTracking()
                .Include(a => a.Coder)
                .Select(a => new CoderDetailDTO
                {
                    CoderID = a.Coder.CoderID,
                    UserName = a.UserName,
                    CoderName = a.Coder.CoderName,
                    CoderEmail = a.Coder.CoderEmail,
                    PhoneNumber = a.Coder.PhoneNumber,
                    Avatar = a.Coder.Avatar,
                    Role = a.RoleID,
                    TotalPoint = a.Coder.Matchs.Sum(m => m.Point)
                });

            // ✅ Thêm tìm kiếm theo tên coder (nếu có)
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                coderQuery = coderQuery.Where(c =>
                    c.CoderName.ToLower().Contains(searchLower));
            }

            // ✅ Sắp xếp theo điểm giảm dần
            coderQuery = coderQuery.OrderByDescending(c => c.TotalPoint);

            var pagedResponse = await PagedResponse<CoderDetailDTO>.CreateAsync(
                 coderQuery,
                 query.Page,
                 query.PageSize);

            return pagedResponse;
        }

        public async Task<Account> GetAccountByCoderIdAsync(int coderId)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(a => a.AccountID == coderId);

            if (account == null)
            {
                throw new KeyNotFoundException("Không tìm thấy tài khoản.");
            }

            return account;
        }


        public async Task<CoderDetailDTO> GetCoderByEmailAsync(string email)
        {
            Coder existing = await _context.Coders.Include(c => c.Account).Where(c => c.CoderEmail == email).FirstOrDefaultAsync();
            if (existing != null)
            {
                return new CoderDetailDTO
                {
                    CoderID = existing.CoderID,
                    CoderName = existing.CoderName,
                    Avatar = existing.Avatar,
                    Description = existing.Description,
                    BirthDay = existing.BirthDay,
                    Gender = existing.Gender,
                    PhoneNumber = existing.PhoneNumber,
                    UpdatedAt = existing.UpdatedAt,
                    UpdatedBy = existing.UpdatedBy,
                    Role = existing.Account.RoleID,
                };
            }
            return null;
        }

        // Cập nhật mật khẩu mới cho user
        public async Task<(bool Success, string Message)> UpdatePasswordAsync(string email, string newPassword)
        {
            var user = await _context.Accounts.FirstOrDefaultAsync(u => u.ReceiveEmail == email);

            if (user == null)
                return (false, "Không tìm thấy người dùng với email này.");

            // Tạo salt và hash password
            var salt = PasswordHelper.GenerateSalt();
            var hashedPassword = PasswordHelper.HashPassword(newPassword, salt);

            user.Password = hashedPassword;
            user.SaltMD5 = salt;

            // Xóa mã reset mật khẩu
            user.PwdResetCode = null;
            user.PwdResetDate = null;

            try
            {
                await _context.SaveChangesAsync();
                return (true, "Mật khẩu đã được đặt lại thành công.");
            }
            catch (Exception ex)
            {
                return (false, $"Cập nhật mật khẩu thất bại: {ex.Message}");
            }
        }

        public async Task<PagedResponse<CoderDTO>> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _context.Coders
                .Include(t => t.Account)
                    .ThenInclude(t => t.Role)
                .AsNoTracking()
                .AsSplitQuery();

            query = SearchHelper<Coder>.ApplySearchMultiField(query, keyword, useAnd: true,
                    t => t.CoderName,
                    t => t.CoderEmail,
                    t => t.Account.UserName,
                    t => t.PhoneNumber,
                    t => t.Account.Role.Name
                );

            query = query.OrderByDescending(t => t.CoderName);

            var pagedTopics = await PagedResponse<Coder>.CreateAsync(query, page, pageSize);

            var dtoList = pagedTopics.Data.Select(t => new CoderDTO
            {
                CoderID = t.CoderID,
                UserName = t.Account.UserName,
                CoderName = t.CoderName,
                CoderEmail = t.CoderEmail,
                PhoneNumber = t.PhoneNumber,
                Role = t.Account.RoleID,
            }).ToList();

            return new PagedResponse<CoderDTO>(
                dtoList,
                pagedTopics.CurrentPage,
                pagedTopics.PageSize,
                pagedTopics.TotalCount,
                pagedTopics.TotalPages
            );
        }

    }
}
