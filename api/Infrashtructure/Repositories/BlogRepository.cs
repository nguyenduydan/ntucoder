using api.Models.ERD;
using api.DTOs;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Infrashtructure.Services;
using Microsoft.Extensions.Caching.Memory;
using api.Infrashtructure.Helpers;
using api.Infrastructure.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace api.Infrashtructure.Repositories
{
    public class BlogRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly MinioService _minioService;
        private readonly IMemoryCache _memoryCache;

        public BlogRepository(ApplicationDbContext context, MinioService minioService, IMemoryCache memoryCache)
        {
            _context = context;
            _minioService = minioService;
            _memoryCache = memoryCache;
        }

        // Lấy danh sách tất cả blog
        public async Task<PagedResponse<BlogDTO>> GetAllAsync(QueryObject query, int? coderID)
        {
            var queryData = _context.Blogs
               .Include(b => b.Coder)
               .AsNoTracking();

            if (coderID.HasValue)
            {
                queryData = queryData.Where(b => b.CoderID == coderID);
            }

            var projected = queryData.Select(b => new BlogDTO
            {
                BlogID = b.BlogID,
                Title = b.Title,
                BlogDate = b.BlogDate,
                Content = b.Content,
                Published = b.Published,
                PinHome = b.PinHome,
                CoderID = b.CoderID,
                CoderName = b.Coder.CoderName,
                AvatarCoder = b.Coder.Avatar,
                ImageBlogUrl = b.BlogImage,
                ViewCount = b.ViewCount.GetValueOrDefault()
            }).OrderByDescending(b => b.BlogDate);

            var pagedResult = await PagedResponse<BlogDTO>.CreateAsync(projected, query.Page, query.PageSize);
            return pagedResult;

        }


        // Lấy blog theo ID
        public async Task<BlogDTO?> GetByIdAsync(int id)
        {
            var blog = await _context.Blogs
                        .Include(b => b.Coder)
                        .Include(b => b.Comments)
                        .FirstOrDefaultAsync(b => b.BlogID == id);

            if (blog == null) return null;

            return MapToBlogDto(blog);
        }


        // Tạo blog mới
        public async Task<Blog> CreateAsync(BlogDTO dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            if (string.IsNullOrWhiteSpace(dto.Title)) throw new ArgumentException("Title is required");
            if (dto.BlogDate > DateTime.Now) throw new ArgumentException("BlogDate cannot be in the future");

            // Kiểm tra CoderID tồn tại
            var coderExists = await _context.Coders.AnyAsync(c => c.CoderID == dto.CoderID);
            if (!coderExists) throw new ArgumentException("Invalid CoderID");

            // Nếu có file Avatar mới thì xử lý upload.
            if (dto.ImageFile != null)
            {
                using (var stream = dto.ImageFile.OpenReadStream())
                {
                    var fileName = $"imgBlog/{dto.BlogID + "_" + dto.BlogDate.ToString() + "_" + dto.CoderID}.jpg"; // Đặt tên file theo ID
                    var bucketName = "ntucoder"; // Tên bucket MinIO

                    // Upload file lên MinIO
                    var fileUrl = await _minioService.UploadFileAsync(stream, fileName, bucketName);
                    dto.ImageBlogUrl = fileUrl;
                }
            }

            var blog = new Blog
            {
                Title = dto.Title,
                BlogDate = DateTime.Now,
                Content = dto.Content,
                BlogImage = dto.ImageBlogUrl,
                Published = dto.Published,
                PinHome = dto.PinHome,
                CoderID = dto.CoderID,
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();
            return blog;
        }

        public async Task<bool> UpdateAsync(int id, BlogDTO dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto));
            if (string.IsNullOrWhiteSpace(dto.Title)) throw new ArgumentException("Title is required");
            if (dto.BlogDate > DateTime.Now) throw new ArgumentException("BlogDate cannot be in the future");

            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;

            var coderExists = await _context.Coders.AnyAsync(c => c.CoderID == dto.CoderID);
            if (!coderExists) throw new ArgumentException("Invalid CoderID");

            blog.Title = dto.Title;
            blog.BlogDate = dto.BlogDate;
            blog.Content = dto.Content;
            blog.Published = dto.Published;
            blog.PinHome = dto.PinHome;
            blog.CoderID = dto.CoderID;

            _context.Blogs.Update(blog);
            await _context.SaveChangesAsync();
            return true;
        }

        //update published and pinHome
        public async Task<bool> UpdateStatusAsync(int id, UpdateStatusDTO dto)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;

            if (dto.Published.HasValue)
                blog.Published = dto.Published.Value;

            if (dto.PinHome.HasValue)
                blog.PinHome = dto.PinHome.Value;

            _context.Blogs.Update(blog); // optional but explicit
            await _context.SaveChangesAsync();
            return true;
        }


        // Xóa blog
        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }

        // increasing view
        public async Task<bool> IncreaseViewAsync(int blogId, string ipAddress)
        {
            if (string.IsNullOrEmpty(ipAddress))
                return false;

            var cacheKey = $"blog_view_{blogId}_{ipAddress}";

            if (_memoryCache.TryGetValue(cacheKey, out _))
            {
                // IP này đã tăng view gần đây
                return false;
            }

            var blog = await _context.Blogs.FindAsync(blogId);
            if (blog == null) return false;

            blog.ViewCount = (blog.ViewCount ?? 0) + 1;
            await _context.SaveChangesAsync();

            // Lưu IP vào cache 5p 
            _memoryCache.Set(cacheKey, true, TimeSpan.FromMinutes(5));

            return true;
        }

        // Lấy top view cao nhất
        public async Task<List<BlogDTO>> GetTopViewedBlogsAsync(int count, bool ascingSort)
        {
            var query = _context.Blogs
                .Include(b => b.Coder)
                .AsNoTracking()
                .Where(b => b.Published == 1);

            // Sắp xếp theo ViewCount tăng hoặc giảm dựa trên ascingSort
            query = ascingSort
                ? query.OrderBy(b => b.ViewCount)
                : query.OrderByDescending(b => b.ViewCount);

            return await query
                .Take(count)
                .Select(b => new BlogDTO
                {
                    BlogID = b.BlogID,
                    Title = b.Title,
                    BlogDate = b.BlogDate,
                    Content = b.Content,
                    Published = b.Published,
                    PinHome = b.PinHome,
                    CoderID = b.CoderID,
                    CoderName = b.Coder.CoderName,
                    AvatarCoder = b.Coder.Avatar,
                    ImageBlogUrl = b.BlogImage,
                    ViewCount = b.ViewCount.GetValueOrDefault()
                })
                .ToListAsync();
        }


        public async Task<PagedResponse<BlogDTO>> GetLatestAsync(QueryObject query, List<int> excludedIds = null)
        {
            var queryData = _context.Blogs
                .Include(b => b.Coder)
                .AsNoTracking()
                .Where(b => b.Published == 1);

            if (excludedIds != null && excludedIds.Any())
            {
                queryData = queryData.Where(b => !excludedIds.Contains(b.BlogID));
            }

            var projected = queryData
                .Select(b => new BlogDTO
                {
                    BlogID = b.BlogID,
                    Title = b.Title,
                    BlogDate = b.BlogDate,
                    Content = b.Content,
                    Published = b.Published,
                    PinHome = b.PinHome,
                    CoderID = b.CoderID,
                    CoderName = b.Coder.CoderName,
                    AvatarCoder = b.Coder.Avatar,
                    ImageBlogUrl = b.BlogImage,
                    ViewCount = b.ViewCount.GetValueOrDefault()
                })
                .OrderByDescending(b => b.BlogDate);

            var pagedResult = await PagedResponse<BlogDTO>.CreateAsync(projected, query.Page, query.PageSize);
            return pagedResult;
        }

        public async Task<PagedResponse<BlogDTO>> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _context.Blogs
                .Include(b => b.Coder)
                .Include(b => b.Comments)  // Nếu cần load comments
                .AsNoTracking();

            query = SearchHelper<Blog>.ApplySearchMultiField(query, keyword, useAnd: true,
                    b => b.Title,
                    b => b.Coder.CoderName,
                    b => b.ViewCount.ToString()
                    );

            query = query.OrderByDescending(b => b.Title);

            // Lấy phân trang dữ liệu Blog entity
            var pagedBlogs = await PagedResponse<Blog>.CreateAsync(query, page, pageSize);

            // Map từng Blog sang BlogDTO
            var dtoList = pagedBlogs.Data.Select(MapToBlogDto).ToList();

            // Tạo PagedResponse<BlogDTO> mới
            var pagedDto = new PagedResponse<BlogDTO>(
                dtoList,
                pagedBlogs.CurrentPage,
                pagedBlogs.PageSize,
                pagedBlogs.TotalCount,
                pagedBlogs.TotalPages);

            return pagedDto;
        }


        private BlogDTO MapToBlogDto(Blog blog)
        {
            if (blog == null) return null;
            

            return new BlogDTO
            {
                BlogID = blog.BlogID,
                Title = blog.Title,
                BlogDate = blog.BlogDate,
                Content = blog.Content,
                Published = blog.Published,
                PinHome = blog.PinHome,
                CoderID = blog.CoderID,
                CoderName = blog.Coder?.CoderName,
                AvatarCoder = blog.Coder?.Avatar,
                ImageBlogUrl = blog.BlogImage,
                ViewCount = blog.ViewCount,
                Comments = blog.Comments?.Select(c => new CommentDTO
                {
                    BlogID = c.BlogID,
                    CoderID = c.CoderID,
                    CommentTime = c.CommentTime,
                    Content = c.Content,
                }).ToList(),

                // Lưu ý: ImageFile là input, không map từ entity ra DTO
                ImageFile = null
            };
        }


    }
}
