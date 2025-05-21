using api.DTOs;
using api.Infrashtructure.Helpers;
using api.Models.ERD;
using api.Models;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

namespace api.Infrashtructure.Repositories
{
    public class ProblemRepository
    {
        private readonly ApplicationDbContext _context;
        public ProblemRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả bài tập với phân trang và tìm kiếm
        public async Task<PagedResponse<ProblemDTO>> GetAllProblemsAsync(QueryObject query, string? sortField = null, bool ascending = true, bool? publishedFilter = null)
        {
            var problemQuery = _context.Problems
                .Include(p => p.Coder)
                .Include(p => p.ProblemCategories)
                    .ThenInclude(pc => pc.Category)
                .AsSplitQuery()
                .Select(p => new ProblemDTO
                {
                    ProblemID = p.ProblemID,
                    ProblemCode = p.ProblemCode,
                    ProblemName = p.ProblemName,
                    MemoryLimit = p.MemoryLimit,
                    TestType = p.TestType,
                    Published = p.Published,
                    CoderID = p.CoderID,
                    CoderName = p.Coder.CoderName,
                    ProblemContent = p.ProblemContent,
                    SelectedCategoryIDs = p.ProblemCategories.Select(pc => pc.CategoryID).ToList(),
                    SelectedCategoryNames = p.ProblemCategories.Select(pc => pc.Category.CatName).ToList()
                });

            // Lọc theo Published nếu có filter
            if (publishedFilter.HasValue)
            {
                var val = publishedFilter.Value ? 1 : 0;
                problemQuery = problemQuery.Where(p => p.Published == val);
            }

            // Áp dụng sắp xếp
            problemQuery = ApplySorting(problemQuery, sortField, ascending);

            // Tạo kết quả phân trang
            var problems = await PagedResponse<ProblemDTO>.CreateAsync(
                problemQuery,
                query.Page,
                query.PageSize);

            return problems;
        }


        // Áp dụng sắp xếp theo trường và hướng
        public IQueryable<ProblemDTO> ApplySorting(IQueryable<ProblemDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "problemcode" => ascending ? query.OrderBy(p => p.ProblemCode) : query.OrderByDescending(p => p.ProblemCode),
                "problemname" => ascending ? query.OrderBy(p => p.ProblemName) : query.OrderByDescending(p => p.ProblemName),
                "published" => ascending ? query.OrderBy(p => p.Published) : query.OrderByDescending(p => p.Published),
                _ => query.OrderBy(p => p.ProblemID),
            };
        }

        // Tạo bài tập mới
        public async Task<ProblemDTO> CreateProblemAsync(ProblemDTO dto)
        {
            // Kiểm tra mã bài tập đã tồn tại
            if (await CheckProblemCodeExist(dto.ProblemCode!))
            {
                throw new ValidationException("Mã bài tập đã tồn tại.");
            }

            var problem = new Problem
            {
                ProblemCode = dto.ProblemCode!,
                ProblemName = dto.ProblemName!,
                TimeLimit = dto.TimeLimit ?? 1,
                MemoryLimit = dto.MemoryLimit ?? 128,
                ProblemContent = dto.ProblemContent!,
                ProblemExplanation = dto.ProblemExplanation!,
                TestType = dto.TestType!,
                TestCode = dto.TestCode!,
                CoderID = (int)dto.CoderID!,
                Published = dto.Published,
                TestCompilerID = dto.TestCompilerID ?? 1,
                TestProgCompile = dto.TestProgCompile
            };

            // Thêm bài tập mới vào cơ sở dữ liệu
            _context.Problems.Add(problem);
            await _context.SaveChangesAsync();

            dto.ProblemID = problem.ProblemID;

            // Gán thể loại nếu có
            if (dto.SelectedCategoryIDs != null && dto.SelectedCategoryIDs.Any())
            {
                foreach (var categoryId in dto.SelectedCategoryIDs)
                {
                    _context.ProblemCategories.Add(new ProblemCategory
                    {
                        ProblemID = problem.ProblemID,
                        CategoryID = categoryId,
                        Note = dto.Note
                    });
                }
            }

            if (dto.SelectedLessonID > 0) // Kiểm tra nếu có bài học được chọn
            {
                var lessonId = dto.SelectedLessonID;

                // Kiểm tra xem bài học này đã được gán với bài tập này chưa
                var exists = await _context.LessonProblems
                    .AnyAsync(lp => lp.LessonID == lessonId && lp.ProblemID == problem.ProblemID);

                if (!exists)
                {
                    _context.LessonProblems.Add(new LessonProblem
                    {
                        ProblemID = problem.ProblemID,
                        LessonID = lessonId,
                    });
                }
                await _context.SaveChangesAsync();
            }

            return dto;
        }


        // Kiểm tra xem mã bài tập có tồn tại không
        private async Task<bool> CheckProblemCodeExist(string pc)
        {
            return await _context.Problems.AnyAsync(p => p.ProblemCode == pc);
        }

        // Xóa bài tập
        public async Task<bool> DeleteProblemAsync(int id)
        {
            var problem = await _context.Problems
                .Include(p => p.ProblemCategories)
                .FirstOrDefaultAsync(p => p.ProblemID == id);

            if (problem == null)
            {
                return false;
            }
            if (problem.ProblemCategories != null && problem.ProblemCategories.Any())
            {
                _context.ProblemCategories.RemoveRange(problem.ProblemCategories);
            }
            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();
            return true;
        }

        // Lấy thông tin chi tiết bài tập theo ID
        public async Task<ProblemDTO> GetProblemByIdAsync(int id)
        {
            var problem = await _context.Problems
                .Where(p => p.ProblemID == id)
                .Include(p => p.ProblemCategories)
                    .ThenInclude(pc => pc.Category)
                .Include(p => p.Coder)
                .Include(p => p.Compiler)
                .Include(p => p.LessonProblems)
                    .ThenInclude(lp => lp.Lesson)
                .FirstOrDefaultAsync();


            if (problem == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài tập");
            }

            return new ProblemDTO
            {
                ProblemCode = problem.ProblemCode!,
                ProblemName = problem.ProblemName!,
                TimeLimit = problem.TimeLimit,
                MemoryLimit = problem.MemoryLimit,
                ProblemContent = problem.ProblemContent!,
                ProblemExplanation = problem.ProblemExplanation!,
                TestType = problem.TestType!,
                TestCode = problem.TestCode!,
                CoderID = problem.CoderID,
                Published = problem.Published,
                TestCompilerID = problem.TestCompilerID,
                CoderName = problem.Coder.CoderName,
                TestCompilerName = problem.Compiler.CompilerName,
                SelectedCategoryIDs = problem.ProblemCategories.Select(pc => pc.CategoryID).ToList(),
                SelectedCategoryNames = problem.ProblemCategories
                .Select(pc => pc.Category.CatName)
                .ToList(),
                SelectedLessonID = problem.LessonProblems.Select(lp => lp.LessonID).FirstOrDefault(),
                SelectedLessonName = problem.LessonProblems.Select(lp => lp.Lesson.LessonTitle).FirstOrDefault(),
                Note = problem.ProblemCategories.Select(pc => pc.Note).FirstOrDefault()
            };
        }

        // Cập nhật thông tin bài tập
        public async Task<ProblemDTO> UpdateProblemAsync(int id, ProblemDTO dto)
        {
            var existing = await _context.Problems
                .Include(p => p.ProblemCategories)
                .Include(p => p.LessonProblems)
                .FirstOrDefaultAsync(p => p.ProblemID == id);

            if (existing == null)
            {
                throw new KeyNotFoundException("Không tìm thấy bài tập.");
            }

            if (!string.IsNullOrEmpty(dto.ProblemCode) && existing.ProblemCode != dto.ProblemCode)
            {
                if (await CheckProblemCodeExist(dto.ProblemCode!))
                {
                    throw new InvalidOperationException("Mã bài tập đã tồn tại.");
                }
                existing.ProblemCode = dto.ProblemCode!;
            }

            existing.ProblemName = dto.ProblemName ?? existing.ProblemName;
            existing.ProblemContent = dto.ProblemContent ?? existing.ProblemContent;
            existing.TimeLimit = dto.TimeLimit ?? existing.TimeLimit;
            existing.MemoryLimit = dto.MemoryLimit ?? existing.MemoryLimit;
            existing.ProblemExplanation = dto.ProblemExplanation ?? existing.ProblemExplanation;
            existing.TestType = dto.TestType ?? existing.TestType;
            existing.TestCode = dto.TestCode ?? existing.TestCode;
            existing.TestCompilerID = dto.TestCompilerID ?? existing.TestCompilerID;
            existing.Published = dto.Published;
            existing.CoderID = dto.CoderID ?? existing.CoderID;

            if (dto.SelectedCategoryIDs != null && dto.SelectedCategoryIDs.Any())
            {
                var existingCategoryIds = existing.ProblemCategories.Select(pc => pc.CategoryID).ToList();
                if (!dto.SelectedCategoryIDs.SequenceEqual(existingCategoryIds))
                {
                    _context.ProblemCategories.RemoveRange(existing.ProblemCategories);

                    foreach (var categoryId in dto.SelectedCategoryIDs)
                    {
                        var problemCategory = new ProblemCategory
                        {
                            ProblemID = existing.ProblemID,
                            CategoryID = categoryId,
                            Note = dto.Note,
                        };
                        _context.ProblemCategories.Add(problemCategory);
                    }
                }
            }

            // 👉 Cập nhật bài học an toàn
            if (dto.SelectedLessonID > 0)
            {
                var existingLessonProblem = existing.LessonProblems.FirstOrDefault();

                // Nếu chưa có -> thêm mới
                if (existingLessonProblem == null)
                {
                    _context.LessonProblems.Add(new LessonProblem
                    {
                        ProblemID = existing.ProblemID,
                        LessonID = dto.SelectedLessonID,
                    });
                }
                // Nếu khác LessonID -> cập nhật
                else if (existingLessonProblem.LessonID != dto.SelectedLessonID)
                {
                    existingLessonProblem.LessonID = dto.SelectedLessonID;
                    _context.LessonProblems.Update(existingLessonProblem);
                }
            }


            await _context.SaveChangesAsync();

            dto.ProblemID = existing.ProblemID;
            return dto;
        }

    }
}
