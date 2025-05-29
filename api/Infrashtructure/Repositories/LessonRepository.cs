using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrastructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class LessonRepository
    {
        private readonly ApplicationDbContext _context;

        public LessonRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<LessonDTO>> GetListAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryData = _context.Lessons
                .AsNoTracking()
                .Include(l => l.Topic)
                .Include(l => l.LessonProblems)
                .Select(l => new LessonDTO
                {
                    LessonID = l.LessonID,
                    LessonTitle = l.LessonTitle,
                    LessonContent = l.LessonContent,
                    TopicName = l.Topic.TopicName,
                    Order = l.Order,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt,
                    Status = l.Status,

                });

            queryData = ApplySorting(queryData, sortField, ascending);

            var lesson = await PagedResponse<LessonDTO>.CreateAsync(
                queryData,
                query.Page,
                query.PageSize
            );
            return lesson;

        }

        public IQueryable<LessonDTO> ApplySorting(IQueryable<LessonDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "lessonTitle" => ascending ? query.OrderBy(l => l.LessonTitle) : query.OrderByDescending(l => l.LessonTitle),
                _ => query.OrderBy(c => c.LessonID) 
            };
        }
        public async Task<LessonDetailDTO> GetByIdAsync(int id)
        {
            var lesson = await _context.Lessons
                .AsNoTracking()
                .Include(l => l.LessonProblems.Where(lp => lp.Problem.Published == 1))
                    .ThenInclude(lp => lp.Problem)
                .Include(l => l.Topic)
                .FirstOrDefaultAsync(l => l.LessonID == id);

            if (lesson == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy bài học với ID: {id}");
            }

            return new LessonDetailDTO
            {
                LessonID = lesson.LessonID,
                TopicID = lesson.TopicID,
                TopicName = lesson.Topic.TopicName,
                LessonTitle = lesson.LessonTitle,
                LessonContent = lesson.LessonContent,
                Order = lesson.Order,
                CreatedAt = lesson.CreatedAt,
                UpdatedAt = lesson.UpdatedAt,
                Status = lesson.Status,
                LessonProblems = lesson.LessonProblems.Select(lp => new LessonProblemDTO
                {
                    ID = lp.ID,
                    LessonID = lp.LessonID,
                    ProblemID = lp.ProblemID,
                    ProblemName = lp.Problem.ProblemName,
                }).ToList(),
            };
        }

        public async Task<LessonDTO> CreateAsync (LessonDTO dto)
        {
            var existing =await _context.Lessons.AnyAsync(l => l.LessonTitle == dto.LessonTitle);
            if (existing)
            {
                throw new InvalidOperationException("Tên bài học đã tồn tại.");
            }

            var topic = await _context.Topics.FirstOrDefaultAsync(t => t.TopicID == dto.TopicID);
            if (topic == null)
            {
                throw new InvalidOperationException("Chủ đề không tồn tại");
            }

            

            var newLesson = new Lesson
            {
                TopicID = dto.TopicID,
                LessonTitle = dto.LessonTitle,
                LessonContent = dto.LessonContent,
                Order = dto.Order ?? 0,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Status = dto.Status,
            };

            _context.Lessons.Add(newLesson);
            await _context.SaveChangesAsync();

            return new LessonDTO
            {
                LessonID = newLesson.LessonID,
                LessonTitle = newLesson.LessonTitle,
                LessonContent = newLesson.LessonContent,
                Order = newLesson.Order,
                CreatedAt = newLesson.CreatedAt,
                UpdatedAt = newLesson.UpdatedAt,
                Status = newLesson.Status,
                TopicID = newLesson.TopicID,
                TopicName = topic.TopicName,
            };
        }

        public async Task<LessonDetailDTO> UpdateAsync(int id, LessonDetailDTO dto)
        {
            var existingLesson = await _context.Lessons
        .Include(l => l.LessonProblems)
        .FirstOrDefaultAsync(l => l.LessonID == id);

            if (existingLesson == null)
            {
                throw new InvalidOperationException($"Không tìm thấy bài học với ID: {id}");
            }

            // Cập nhật các trường
            if (!string.IsNullOrEmpty(dto.LessonTitle))
                existingLesson.LessonTitle = dto.LessonTitle;

            if (!string.IsNullOrEmpty(dto.LessonContent))
                existingLesson.LessonContent = dto.LessonContent;

            existingLesson.Order = dto.Order ?? 0;
            existingLesson.TopicID = dto.TopicID;
            existingLesson.Status = dto.Status;
            existingLesson.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            // Truy vấn để lấy TopicName từ bảng Topics
            var topic = await _context.Topics
                .FirstOrDefaultAsync(t => t.TopicID == existingLesson.TopicID);

            return new LessonDetailDTO
            {
                LessonID = existingLesson.LessonID,
                TopicID = existingLesson.TopicID,
                TopicName = topic?.TopicName ?? "Chưa xác định", // nếu topic null thì trả fallback
                LessonTitle = existingLesson.LessonTitle,
                LessonContent = existingLesson.LessonContent,
                Order = existingLesson.Order,
                CreatedAt = existingLesson.CreatedAt,
                UpdatedAt = existingLesson.UpdatedAt,
                Status = existingLesson.Status,
                LessonProblems = existingLesson.LessonProblems
                    .Select(lp => new LessonProblemDTO
                    {
                        ID = lp.ID,
                        LessonID = lp.LessonID,
                        ProblemID = lp.ProblemID
                    })
                    .ToList()
            };
        }



        public async Task<bool> DeleteAsync(int id)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Topic)
                .FirstOrDefaultAsync(l => l.LessonID == id);

            if (lesson == null)
            {
                throw new KeyNotFoundException("Bài học không tồn tại");
            }
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<PagedResponse<LessonDetailDTO>> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _context.Lessons
                   .AsNoTracking()
                   .Include(l => l.Topic)
                   .Include(l => l.LessonProblems)
                   .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = SearchHelper<Lesson>.ApplySearchMultiField(query, keyword, useAnd: true,
                    l => l.LessonTitle,
                    l => l.Topic.TopicName);
            }

            var paged = await PagedResponse<Lesson>.CreateAsync(query, page, pageSize);

            var dtoList = paged.Data.Select(l => new LessonDetailDTO
            {
                LessonID = l.LessonID,
                LessonTitle = l.LessonTitle,
                LessonContent = l.LessonContent,
                Status = l.Status,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt,
                TopicID = l.Topic?.TopicID ?? 0,
                TopicName = l.Topic?.TopicName,
            }).ToList();

            return new PagedResponse<LessonDetailDTO>(
                dtoList,
                paged.CurrentPage,
                paged.PageSize,
                paged.TotalCount,
                paged.TotalPages
            );
        }
    }
}
