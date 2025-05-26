using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Infrastructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Services
{
    public class SearchAllService
    {
        private readonly ApplicationDbContext _context;

        public SearchAllService (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SearchSuggestionDTO>> SearchSuggestionsAsync(string keyword, int maxResults = 10)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return new List<SearchSuggestionDTO>();

            keyword = keyword.Trim();

            var suggestions = new List<SearchSuggestionDTO>();
            int remaining = maxResults;

            // === Search Course (Prioritized First) ===
            var courseQuery = _context.Courses.AsNoTracking().Where(c => c.Status == 1);
            courseQuery = SearchHelper<Course>.ApplySearchMultiField(courseQuery, keyword, useAnd: false,
                c => c.CourseName,
                c => c.Description);

            var courses = await courseQuery
                .OrderBy(c => c.CourseName)
                .Take(remaining)
                .Select(c => new SearchSuggestionDTO
                {
                    Id = c.CourseID,
                    Name = c.CourseName,
                    Type = "course"
                }).ToListAsync();

            suggestions.AddRange(courses);
            remaining = maxResults - suggestions.Count;

            // === Search Coder (Second Priority) ===
            if (remaining > 0)
            {
                var coderQuery = _context.Coders
                    .Include(c => c.Account)
                    .ThenInclude(a => a.Role)
                    .AsNoTracking();

                coderQuery = SearchHelper<Coder>.ApplySearchMultiField(coderQuery, keyword, useAnd: false,
                    c => c.CoderName,
                    c => c.CoderEmail,
                    c => c.Account.UserName,
                    c => c.PhoneNumber,
                    c => c.Account.Role.Name);

                var coders = await coderQuery
                    .OrderBy(c => c.CoderName)
                    .Take(remaining)
                    .Select(c => new SearchSuggestionDTO
                    {
                        Id = c.CoderID,
                        Name = c.CoderName,
                        Type = "coder"
                    }).ToListAsync();

                suggestions.AddRange(coders);
                remaining = maxResults - suggestions.Count;
            }

            // === Search Blog (Last Priority) ===
            if (remaining > 0)
            {
                var blogQuery = _context.Blogs.AsNoTracking().Where(b => b.Published == 1);
                blogQuery = SearchHelper<Blog>.ApplySearchMultiField(blogQuery, keyword, useAnd: false,
                    b => b.Title,
                    b => b.Coder.CoderName,
                    b => b.Content);

                var blogs = await blogQuery
                    .OrderBy(b => b.Title)
                    .Take(remaining)
                    .Select(b => new SearchSuggestionDTO
                    {
                        Id = b.BlogID,
                        Name = b.Title,
                        Type = "blog"
                    }).ToListAsync();

                suggestions.AddRange(blogs);
            }

            return suggestions;
        }

    }
}
