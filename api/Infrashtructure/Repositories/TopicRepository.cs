﻿using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrastructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class TopicRepository
    {
        private readonly ApplicationDbContext _context;

        public TopicRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<TopicDTO>> GetListAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            var queryData = _context.Topics
                .AsNoTracking()
                .Include(t => t.Course) 
                .AsQueryable();       

            queryData = ApplySorting(queryData, sortField, ascending); 

            var projectedData = queryData.Select(t => new TopicDTO
            {
                TopicID = t.TopicID,
                CourseID = t.CourseID,
                CourseName = t.Course.CourseName,
                TopicName = t.TopicName,
                TopicDescription = t.TopicDescription,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Status = t.Status,
            });

            var topic = await PagedResponse<TopicDTO>.CreateAsync(
                projectedData,
                query.Page,
                query.PageSize
            );

            return topic;
        }

        public IQueryable<Topic> ApplySorting(IQueryable<Topic> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "topicname" => ascending ? query.OrderBy(b => b.TopicName) : query.OrderByDescending(b => b.TopicName),
                _ => query.OrderBy(b => b.TopicID)  
            };
        }


        public async Task<TopicDetailDTO> GetById(int id)
        {
            var topicDto = await _context.Topics
                .AsNoTracking()
                .Where(t => t.TopicID == id)
                .Select(t => new TopicDetailDTO
                {
                    TopicID = t.TopicID,
                    CourseID = t.CourseID,
                    CourseName = t.Course.CourseName,
                    TopicName = t.TopicName,
                    TopicDescription = t.TopicDescription,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Status = t.Status,
                    Lessons = t.Lessons.Select(l => new LessonDTO
                    {
                        LessonID = l.LessonID,
                        LessonTitle = l.LessonTitle,
                        Status = l.Status,
                        CreatedAt = l.CreatedAt
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (topicDto == null)
                throw new KeyNotFoundException($"Chủ đề với ID {id} không tồn tại.");

            return topicDto;
        }


        public async Task<TopicDTO> CreateAsync(TopicDTO dto)
        {
            bool isExisting = await _context.Topics
                .AsNoTracking()
                .AnyAsync(c => c.TopicName == dto.TopicName);

            if (isExisting)
            {
                throw new InvalidOperationException("Tên chủ đề đã tồn tại.");
            }

            // Tìm CourseName từ CourseID
           var courseName = await _context.Courses
                .Where(c => c.CourseID == dto.CourseID)
                .Select(c => c.CourseName)
                .FirstOrDefaultAsync();

            if (courseName == null)
                throw new InvalidOperationException("Khóa học không tồn tại.");

            var newTopic = new Topic
            {
                CourseID = dto.CourseID,
                TopicName = dto.TopicName,
                TopicDescription = dto.TopicDescription,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Status = dto.Status,
            };

            _context.Topics.Add(newTopic);
            await _context.SaveChangesAsync();

            return new TopicDTO
            {
                TopicID = newTopic.TopicID,
                CourseID = newTopic.CourseID,
                CourseName = courseName,
                TopicName = newTopic.TopicName,
                TopicDescription = newTopic.TopicDescription,
                CreatedAt = newTopic.CreatedAt,
                UpdatedAt = newTopic.UpdatedAt,
                Status = newTopic.Status,
            };
        }

        public async Task<TopicDetailDTO> UpdateAsync(int id,TopicDetailDTO dto)
        {
            var existingTopic = await _context.Topics
                .Include(t => t.Course)
                .Include(t => t.Lessons)
                .FirstOrDefaultAsync(t => t.TopicID == id);
            if (existingTopic == null)
            {
                throw new InvalidOperationException($"Không tìm thấy topic với {id}");
            }

            if(!string.IsNullOrEmpty(dto.TopicName)) existingTopic.TopicName = dto.TopicName;
            if(!string.IsNullOrEmpty(dto.CourseName)) existingTopic.Course.CourseName = dto.CourseName;
            if(!string.IsNullOrEmpty(dto.TopicDescription)) existingTopic.TopicDescription = dto.TopicDescription;
            existingTopic.Status = dto.Status;
            existingTopic.UpdatedAt = DateTime.Now;

            if (dto.CourseID != 0)
            {
                var courseExist = await _context.Courses.AnyAsync(c => c.CourseID == dto.CourseID);
                if (!courseExist) throw new Exception("CourseID không hợp lệ");
                existingTopic.CourseID = dto.CourseID;
            }

            if (dto.Lessons != null && dto.Lessons.Any())
            {
                existingTopic.Lessons = dto.Lessons.Select(l => new Lesson
                {
                    LessonID = l.LessonID,
                    TopicID = existingTopic.TopicID,
                    LessonTitle = l.LessonTitle,
                    LessonContent = l.LessonContent,
                    Order = l.Order ?? 0,
                    CreatedAt = l.CreatedAt,
                    UpdatedAt = l.UpdatedAt,
                    Status = l.Status
                }).ToList();
            }


            _context.Topics.Update(existingTopic);
            await _context.SaveChangesAsync();
            return new TopicDetailDTO
            {
                TopicID = existingTopic.TopicID,
                TopicName = existingTopic.TopicName,
                CourseID = existingTopic.CourseID,
                CourseName = existingTopic.Course?.CourseName ?? dto.CourseName,
                TopicDescription = existingTopic.TopicDescription,
                CreatedAt = existingTopic.CreatedAt,
                UpdatedAt = existingTopic.UpdatedAt,
                Status = existingTopic.Status,
            };
        }


        public async Task<bool> DeleteAsync(int id)
        {
            var topic = await _context.Topics
                .Include(c => c.Course)
                .FirstOrDefaultAsync(c => c.TopicID == id);

            if (topic == null)
            {
                throw new KeyNotFoundException("Khóa học không tồn tại.");
            }

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<TopicDTO>> SearchAsync(string? keyword, int page, int pageSize)
        {
            var query = _context.Topics
                .Include(t => t.Course)
                .AsNoTracking();

            query = SearchHelper<Topic>.ApplySearchMultiField(query, keyword, useAnd: true,
                    t => t.TopicName,
                    t => t.Course.CourseName
                );

            query = query.OrderByDescending(t => t.CreatedAt);

            var pagedTopics = await PagedResponse<Topic>.CreateAsync(query, page, pageSize);

            var dtoList = pagedTopics.Data.Select(t => new TopicDTO
            {
                TopicID = t.TopicID,
                CourseID = t.CourseID,
                CourseName = t.Course.CourseName,
                TopicName = t.TopicName,
                TopicDescription = t.TopicDescription,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                Status = t.Status
            }).ToList();

            return new PagedResponse<TopicDTO>(
                dtoList,
                pagedTopics.CurrentPage,
                pagedTopics.PageSize,
                pagedTopics.TotalCount,
                pagedTopics.TotalPages
            );
        }

    }
}
