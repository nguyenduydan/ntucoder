using api.Models.ERD;
using api.DTOs;
using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.Infrashtructure.Repositories
{
    public class BlogRepository
    {
        private readonly ApplicationDbContext _context;

        public BlogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy danh sách tất cả blog
        public async Task<List<BlogDTO>> GetAllAsync()
        {
            return await _context.Blogs
                .Include(b => b.Coder)
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
                    Avatar = b.Coder.Avatar,
                }).ToListAsync();
        }

        // Lấy blog theo ID
        public async Task<BlogDTO?> GetByIdAsync(int id)
        {
            return await _context.Blogs
                .Include(b => b.Coder)
                .Where(b => b.BlogID == id)
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
                    Avatar = b.Coder.Avatar,
                }).FirstOrDefaultAsync();
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

            var blog = new Blog
            {
                Title = dto.Title,
                BlogDate = DateTime.Now,
                Content = dto.Content,
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

        // Xóa blog
        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return false;

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
