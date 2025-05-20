using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
using System;

namespace api.Infrashtructure.Repositories
{
    public class CommentRepository
    {
        private readonly ApplicationDbContext _context;

        public CommentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<CommentResponseDto>> GetCommentsAsync(
          int? blogId,
          int? courseId,
          int page = 1,
          int pageSize = 10,
          string sortBy = "CommentTime",
          bool ascending = false)
        {
            var query = _context.Comments
                .Where(c => c.ParentCommentID == null &&
                            (blogId == null || c.BlogID == blogId) &&
                            (courseId == null || c.CourseID == courseId))
                .Include(c => c.Coder)
                .Include(c => c.Replies!)
                    .ThenInclude(r => r.Coder)
                .AsQueryable()
                .AsSplitQuery();

            if (!string.IsNullOrEmpty(sortBy))
            {
                if (sortBy == "CommentTime")
                {
                    query = ascending
                        ? query.OrderBy(c => c.CommentTime)
                        : query.OrderByDescending(c => c.CommentTime);
                }
                else
                {
                    query = query.OrderByDescending(c => c.CommentTime);
                }
            }
            else
            {
                query = query.OrderByDescending(c => c.CommentTime);
            }

            var pagedResult = await PagedResponse<Comment>.CreateAsync(query, page, pageSize);

            var dtoList = pagedResult.Data.Select(c => MapToDto(c)).ToList();

            return new PagedResponse<CommentResponseDto>(
                dtoList, pagedResult.CurrentPage, pagedResult.PageSize, pagedResult.TotalCount, pagedResult.TotalPages);
        }

        public async Task<CommentResponseDto?> GetByIdAsync(int commentId)
        {
            var c = await _context.Comments
                .Include(c => c.Coder)
                .Include(c => c.Replies!)
                    .ThenInclude(r => r.Coder)
                .FirstOrDefaultAsync(c => c.CommentID == commentId);

            return c == null ? null : MapToDto(c);
        }

        public async Task<CommentResponseDto> AddCommentAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            // Lấy lại để load Coder
            var created = await _context.Comments
                .Include(c => c.Coder)
                .FirstOrDefaultAsync(c => c.CommentID == comment.CommentID);

            return MapToDto(created!);
        }
        public async Task<bool> DeleteCommentAsync(int commentId, int coderId)
        {
            // Lấy comment, kèm replies, để xóa
            var comment = await _context.Comments
                .Include(c => c.Replies)
                .FirstOrDefaultAsync(c => c.CommentID == commentId);

            if (comment == null)
                return false; // comment không tồn tại

            if (comment.CoderID != coderId)
                return false; // không phải chủ sở hữu, không được phép xóa

            // Nếu muốn xóa cả replies con (các comment con)
            if (comment.Replies != null && comment.Replies.Any())
            {
                _context.Comments.RemoveRange(comment.Replies);
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return true; // xóa thành công
        }

        public async Task<PagedResponse<CommentResponseDto>> GetListCommentsByCoderIdAsync(QueryObject query, int coderId)
        {
            var commentsQuery = _context.Comments
                .Where(c => c.CoderID == coderId)
                .Include(c => c.Coder)
                .Include(c => c.Replies!)
                    .ThenInclude(r => r.Coder)
                .OrderByDescending(c => c.CommentTime)
                .AsQueryable();

            // Gọi CreateAsync với IQueryable<Comment> 
            var pagedComments = await PagedResponse<Comment>.CreateAsync(
                commentsQuery,
                query.Page,
                query.PageSize
            );

            // Map List<Comment> sang List<CommentResponseDto>
            var mappedList = pagedComments.Data.Select(MapToDto).ToList();

            // Trả về kết quả đã map với paging
            return new PagedResponse<CommentResponseDto>(
                mappedList,
                pagedComments.CurrentPage,
                pagedComments.PageSize,
                pagedComments.TotalCount,
                pagedComments.TotalPages
            );
        }

        private CommentResponseDto MapToDto(Comment comment)
        {
            return new CommentResponseDto
            {
                CommentID = comment.CommentID,
                CoderID = comment.CoderID,
                CourseID = comment.CourseID,
                ParentCommentID = comment.ParentCommentID,
                BlogID = comment.BlogID,
                Content = comment.Content,
                CommentTime = comment.CommentTime,
                CoderName = comment.Coder?.CoderName ?? "Ẩn danh",
                CoderAvatar = comment.Coder?.Avatar,
                Replies = comment.Replies?
                            .OrderBy(r => r.CommentTime)
                            .Select(MapToDto)
                            .ToList()
            };
        }
    }
}
