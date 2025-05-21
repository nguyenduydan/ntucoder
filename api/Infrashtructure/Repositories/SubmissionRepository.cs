using api.DTOs;
using api.Infrashtructure.Enums;
using api.Infrashtructure.Helpers;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class SubmissionRepository
    {
        private readonly ApplicationDbContext _context;

        public SubmissionRepository (ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResponse<SubmissionDTO>> GetAllSubmissionsAsync(
             QueryObject query,
             string? sortField = null,
             bool ascending = true,
             string? searchString = null,
             string? compilerFilter = null)
        {
            var objQuery = _context.Submissions
                .Include(a => a.Problem)
                .Include(a => a.Coder)
                .Include(a => a.Compiler)
                .AsSplitQuery()
                .Select(a => new SubmissionDTO
                {
                    SubmissionID = a.SubmissionID,
                    ProblemID = a.ProblemID,
                    ProblemName = a.Problem.ProblemName,
                    CoderID = a.CoderID,
                    CoderName = a.Coder.CoderName,
                    CompilerName = a.Compiler.CompilerName,
                    TestResult = a.TestResult,
                    MaxTimeDuration = a.MaxTimeDuration,
                    SubmitTime = a.SubmitTime,
                    SubmissionStatus = a.SubmissionStatus ,
                });
            if (!string.IsNullOrWhiteSpace(searchString))
            {
                var lowerSearch = searchString.ToLower();
                objQuery = objQuery.Where(c =>
                    c.CoderName!.ToLower().Contains(lowerSearch) ||
                    c.ProblemName!.ToLower().Contains(lowerSearch));
            }
            if (!string.IsNullOrWhiteSpace(compilerFilter))
            {
                var lowerCompiler = compilerFilter.ToLower();
                objQuery = objQuery.Where(c =>
                    c.CompilerName!.ToLower().Contains(lowerCompiler));
            }

            objQuery = ApplySorting(objQuery, sortField, ascending);

            var obj = await PagedResponse<SubmissionDTO>.CreateAsync(
                objQuery,
                query.Page,
                query.PageSize);
            return obj;
        }

        public IQueryable<SubmissionDTO> ApplySorting(IQueryable<SubmissionDTO> query, string? sortField, bool ascending)
        {
            return sortField?.ToLower() switch
            {
                "codername" => ascending ? query.OrderBy(a => a.CoderName) : query.OrderByDescending(a => a.CoderName),
                "problemname" => ascending ? query.OrderBy(a => a.ProblemName) : query.OrderByDescending(a => a.ProblemName),
                "submittime" => ascending ? query.OrderBy(a => a.SubmitTime) : query.OrderByDescending(a => a.SubmitTime),
                "maxtimeduration" => ascending ? query.OrderBy(a => a.MaxTimeDuration) : query.OrderByDescending(a => a.MaxTimeDuration),
                _ => query.OrderBy(a => a.SubmissionID)
            };
        }

        public async Task<SubmissionDTO> CreateSubmissionAsync(SubmissionDTO dto)
        {
            var exists = await _context.Submissions
                .AnyAsync(s => s.CoderID == dto.CoderID && s.ProblemID == dto.ProblemID);

            if (exists)
            {
                throw new InvalidOperationException("Bạn đã nộp bài cho bài tập này rồi.");
            }

            var submission = new Submission
            {
                ProblemID = dto.ProblemID,
                CoderID = dto.CoderID,
                CompilerID = dto.CompilerID,
                SubmitTime = DateTime.Now,
                SubmissionCode = dto.SubmissionCode ?? "",
                SubmissionStatus = dto.SubmissionStatus,
                CreatedAt = DateTime.Now
            };

            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();

            dto.SubmissionID = submission.SubmissionID;
            return dto;
        }

       
        public async Task<bool> DeleteSubmissionAsync(int id)
        {
            var obj = await _context.Submissions.FirstOrDefaultAsync(o => o.SubmissionID == id);
            if (obj == null)
            {
                return false;
            }
            _context.Submissions.Remove(obj);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<SubmissionDTO> GetSubmissionByIdAsync(int id)
        {
            var obj = await _context.Submissions
                .Include(o => o.Problem)
                .Include(o => o.Compiler)
                .Include(o => o.Coder)
                .FirstOrDefaultAsync(o => o.SubmissionID == id);
            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy");
            }

            return new SubmissionDTO
            {
                SubmissionID = obj.SubmissionID,
                CoderName = obj.Coder.CoderName,
                CoderID = obj.CoderID,
                CompilerName = obj.Compiler.CompilerName,
                ProblemID = obj.ProblemID,
                ProblemName = obj.Problem.ProblemName,
                CompilerID = obj.CompilerID,
                SubmissionCode = obj.SubmissionCode,
                SubmitTime = obj.SubmitTime,
                SubmissionStatus = obj.SubmissionStatus,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxMemorySize = obj.MaxMemorySize,
                MaxTimeDuration = obj.MaxTimeDuration

            };
        }
        public async Task<SubmissionDTO> UpdateSubmissionAsync(SubmissionDTO dto)
        {
            var obj = await _context.Submissions
        .FirstOrDefaultAsync(o => o.CoderID == dto.CoderID && o.ProblemID == dto.ProblemID);

            if (obj == null)
            {
                throw new KeyNotFoundException("Không tìm thấy Submission.");
            }

            obj.CompilerID = dto.CompilerID != 0 ? dto.CompilerID : obj.CompilerID;
            obj.SubmissionCode = string.IsNullOrEmpty(dto.SubmissionCode) ? obj.SubmissionCode : dto.SubmissionCode;
            obj.SubmitTime = DateTime.UtcNow;
            obj.SubmissionStatus = dto.SubmissionStatus != 0 ? dto.SubmissionStatus : obj.SubmissionStatus;
            obj.TestRunCount = dto.TestRunCount ?? obj.TestRunCount;
            obj.TestResult = string.IsNullOrEmpty(dto.TestResult) ? obj.TestResult : dto.TestResult;

            if (obj.TestRuns.Any())
            {
                obj.MaxTimeDuration = obj.TestRuns.Max(tr => tr.TimeDuration);
            }
            else
            {
                obj.MaxTimeDuration = 0;
            }

            await _context.SaveChangesAsync();

            return new SubmissionDTO
            {
                SubmissionID = obj.SubmissionID,
                CompilerID = obj.CompilerID,
                SubmissionCode = obj.SubmissionCode,
                SubmitTime = obj.SubmitTime,
                SubmissionStatus = obj.SubmissionStatus,
                TestRunCount = obj.TestRunCount,
                TestResult = obj.TestResult,
                MaxTimeDuration = obj.MaxTimeDuration
            };
        }

        public async Task UpdateSubmissionAfterTestRunAsync(int submissionId)
        {
            var submission = await _context.Submissions
                .Include(s => s.TestRuns)
                .FirstOrDefaultAsync(s => s.SubmissionID == submissionId);

            if (submission == null)
                throw new KeyNotFoundException("Không tìm thấy submission.");

            submission.TestRunCount = submission.TestRuns.Count;

            // Ưu tiên lỗi biên dịch (nếu có)
            if (submission.TestRuns.Any(tr => tr.Result == "CompilationError"))
            {
                submission.SubmissionStatus = SubmissionStatus.CompilationError;
            }
            else if (submission.TestRuns.Any(tr => tr.Result == "RuntimeError"))
            {
                submission.SubmissionStatus = SubmissionStatus.RuntimeError;
            }
            else if (submission.TestRuns.Any(tr => tr.Result == "MemoryLimitExceeded"))
            {
                submission.SubmissionStatus = SubmissionStatus.MemoryLimitExceeded;
            }
            else if (submission.TestRuns.Any(tr => tr.Result == "TimeLimitExceeded"))
            {
                submission.SubmissionStatus = SubmissionStatus.TimeLimitExceeded;
            }
            else if (submission.TestRuns.Any(tr => tr.Result == "WrongAnswer"))
            {
                submission.SubmissionStatus = SubmissionStatus.WrongAnswer;
            }
            else if (submission.TestRuns.All(tr => tr.Result == "Accepted"))
            {
                submission.SubmissionStatus = SubmissionStatus.Accepted;
            }
            else
            {
                submission.SubmissionStatus = SubmissionStatus.Pending; // fallback nếu chưa rõ
            }

            submission.MaxTimeDuration = submission.TestRuns.Max(tr => tr.TimeDuration);
            submission.TestResult = submission.SubmissionStatus.ToString();

            await _context.SaveChangesAsync();
        }

        public async Task<PagedResponse<SubmissionDTO>> GetSubmissionHistoryAsync(
      QueryObject queryable,
      int? problemId = null,
      string? sortField = null,
      bool ascending = true,
      int? coderId = null)
        {
            var query = _context.Submissions
                .Include(s => s.Compiler)
                .Include(s => s.Coder)
                .Include(s => s.Problem)
                .AsQueryable();

            if (problemId.HasValue)
            {
                query = query.Where(s => s.ProblemID == problemId.Value);
            }

            if (coderId.HasValue)
            {
                query = query.Where(s => s.CoderID == coderId.Value);
            }

            var projectedQuery = query.Select(s => new SubmissionDTO
            {
                SubmissionID = s.SubmissionID,
                CompilerID = s.CompilerID,
                CompilerName = s.Compiler.CompilerName,
                SubmissionCode = s.SubmissionCode,
                SubmitTime = s.SubmitTime,
                SubmissionStatus = s.SubmissionStatus,
                TestRunCount = s.TestRunCount,
                TestResult = s.TestResult,
                MaxTimeDuration = s.MaxTimeDuration,
                ProblemID = s.ProblemID,
                ProblemName = s.Problem.ProblemName,
                CoderID = s.CoderID,
                CoderName = s.Coder.CoderName,
                Point = 0
            });

            var sortedQuery = ApplySorting(projectedQuery, sortField, ascending);

            var pagedResult = await PagedResponse<SubmissionDTO>.CreateAsync(sortedQuery, queryable.Page, queryable.PageSize);

            // Lấy tất cả các ProblemID hiện có trong page
            var problemIdsInPage = pagedResult.Data.Select(d => d.ProblemID).Distinct().ToList();
            var coderIdsInPage = pagedResult.Data.Select(d => d.CoderID).Distinct().ToList();

            // Lấy LessonProblems cho các ProblemID này
            var lessonProblems = await _context.LessonProblems
                .Where(lp => problemIdsInPage.Contains(lp.ProblemID))
                .ToListAsync();

            if (lessonProblems.Count > 0)
            {
                // Lấy tất cả Matches tương ứng với coderId và LessonProblemID
                var lessonProblemIds = lessonProblems.Select(lp => lp.ID).ToList();

                var matchesQuery = _context.Matches
                    .Where(m => lessonProblemIds.Contains(m.LessonProblemID) && coderIdsInPage.Contains(m.CoderID));

                if (coderId.HasValue)
                {
                    matchesQuery = matchesQuery.Where(m => m.CoderID == coderId.Value);
                }

                var matches = await matchesQuery.ToListAsync();

                // Tạo dictionary theo cặp (CoderID, ProblemID) để dễ lookup điểm
                var lessonProblemDict = lessonProblems.ToDictionary(lp => lp.ID, lp => lp.ProblemID);
                var matchesDict = matches.ToLookup(m => (m.CoderID, lessonProblemDict[m.LessonProblemID]));

                foreach (var sub in pagedResult.Data)
                {
                    var key = (sub.CoderID, sub.ProblemID);
                    var matched = matchesDict[key].FirstOrDefault();
                    if (matched != null)
                    {
                        sub.Point = matched.Point;
                    }
                }
            }

            return pagedResult;
        }

        //Tính điểm và lưu vào trong Solved
        public async Task ProcessSolvedAndMatchAsync(SubmissionDTO dto)
        {
            if (dto.SubmissionStatus != SubmissionStatus.Accepted)
                return;

            var submission = new Submission
            {
                SubmissionID = dto.SubmissionID,
                ProblemID = dto.ProblemID,
                CoderID = dto.CoderID,
                SubmissionStatus = dto.SubmissionStatus
            };

            var isSolved = await _context.Solved
                .AnyAsync(s => s.ProblemID == submission.ProblemID && s.CoderID == submission.CoderID);

            if (!isSolved)
            {
                _context.Solved.Add(new Solved
                {
                    ProblemID = submission.ProblemID,
                    CoderID = submission.CoderID
                });
            }

            var lessonProblems = await _context.LessonProblems
                .Where(lp => lp.ProblemID == submission.ProblemID)
                .ToListAsync();

            foreach (var lp in lessonProblems)
            {
                var match = await _context.Matches
                    .FirstOrDefaultAsync(m => m.LessonProblemID == lp.ID && m.CoderID == submission.CoderID);

                if (match == null)
                {
                    _context.Matches.Add(new Match
                    {
                        CoderID = submission.CoderID,
                        LessonProblemID = lp.ID,
                        Point = 100
                    });
                }
                else
                {
                    match.Point = Math.Max(match.Point, 100);
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}
