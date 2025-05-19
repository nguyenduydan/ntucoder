using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models.ERD;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly CommentRepository _commentRepository;
        private readonly AuthService _authService;

        public CommentsController(CommentRepository commentRepository, AuthService authService)
        {
            _commentRepository = commentRepository;
            _authService = authService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
               [FromQuery] int? blogId,
               [FromQuery] int? courseId,
               [FromQuery] int page = 1,
               [FromQuery] int pageSize = 10,
               [FromQuery] string sortBy = "CommentTime",
               [FromQuery] bool ascending = false)
        {
            var pagedComments = await _commentRepository.GetCommentsAsync(blogId, courseId, page, pageSize, sortBy, ascending);
            return Ok(pagedComments);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var comment = await _commentRepository.GetByIdAsync(id);
            if (comment == null) return NotFound();
            return Ok(comment);
        }

        [HttpGet("by-coder")]
        [Authorize]
        public async Task<IActionResult> GetCommentsByCoderId([FromQuery] QueryObject query, int coderId)
        {
            if (query == null)
                return BadRequest("Query parameters are required.");

            var coderToken = _authService.GetUserIdFromToken();
            if (coderToken == -1)
                return Unauthorized();

            // Chỉ cho phép lấy comment của chính mình
            if (coderId != coderToken)
                return BadRequest("Bạn không có quyền xem bình luận của người khác.");

            var result = await _commentRepository.GetListCommentsByCoderIdAsync(query, coderId);

            if (result == null || !result.Data.Any())
                return NotFound("Không tìm thấy bình luận nào.");

            return Ok(result);
        }


        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Post([FromBody] CommentDTO dto)
        {
            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1)
                return Unauthorized();

            var comment = new Comment
            {
                Content = dto.Content.Trim(),
                CoderID = coderId,
                BlogID = dto.BlogID,
                CourseID = dto.CourseID,
                ParentCommentID = dto.ParentCommentID,
                CommentTime = DateTime.Now
            };

            var savedComment = await _commentRepository.AddCommentAsync(comment);
            return CreatedAtAction(nameof(Get), new { id = savedComment.CommentID }, savedComment);
        }

        [HttpDelete("{id}")]
        [Authorize]  // Chỉ user đăng nhập mới được xóa
        public async Task<IActionResult> DeleteComment(int id)
        {

            var coderId = _authService.GetUserIdFromToken();
            if (coderId == -1)
            {
                return Unauthorized("Không xác định được người dùng");
            }

            var result = await _commentRepository.DeleteCommentAsync(id, coderId);

            if (!result)
            {
                return Forbid("Bạn không có quyền xóa bình luận này hoặc bình luận không tồn tại");
            }

            return NoContent(); // 204 - xóa thành công, không trả về nội dung
        }
    }
}
