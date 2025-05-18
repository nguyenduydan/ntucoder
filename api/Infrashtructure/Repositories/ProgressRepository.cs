using api.DTOs;
using api.Infrashtructure.Enums;
using api.Models;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;

namespace api.Infrashtructure.Repositories
{
    public class ProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public ProgressRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        //lấy danh sách problemId mà coder đã hoàn thành
        public async Task<List<object>> GetSolvedProblems(int coderId, int lessonId)
        {
            var problemIdsInLesson = await _context.LessonProblems
                .Where(lp => lp.LessonID == lessonId)
                .Select(lp => lp.ProblemID)
                .ToListAsync();

            var solvedProblemIds = await _context.Solved
                .Where(s => s.CoderID == coderId && problemIdsInLesson.Contains(s.ProblemID))
                .Select(s => s.ProblemID)
                .Distinct()
                .ToListAsync();

            var result = solvedProblemIds.Select(pid => new { problemId = pid }).Cast<object>().ToList();

            return result;
        }
        public async Task<int?> GetCourseIdFromProblemAsync(int problemId)
        {
            var courseId = await _context.LessonProblems
                .Where(lp => lp.ProblemID == problemId)
                .Select(lp => lp.Lesson.Topic.CourseID) // Assumes full navigation: Lesson → Topic → Course
                .FirstOrDefaultAsync();

            return courseId == 0 ? null : courseId;
        }


        // Cập nhật progress sau khi submission thành công
        public async Task UpdateProgressAfterSubmissionAsync(int coderId, int problemId)
        {
            // Lấy các lesson chứa problem
            var lessonProblems = await _context.LessonProblems
                .Where(lp => lp.ProblemID == problemId)
                .ToListAsync();

            foreach (var lp in lessonProblems)
            {
                // Tính progress lesson dựa trên số problem đã solve
                var totalProblems = await _context.LessonProblems
                    .CountAsync(x => x.LessonID == lp.LessonID);

                var solvedCount = await _context.Solved
                    .CountAsync(s => s.CoderID == coderId && _context.LessonProblems.Any(lp2 => lp2.LessonID == lp.LessonID && lp2.ProblemID == s.ProblemID));

                double percent = totalProblems == 0 ? 0 : (double)solvedCount / totalProblems * 100;

                // Cập nhật hoặc tạo mới progress lesson
                var progress = await _context.Progresses
                    .FirstOrDefaultAsync(p => p.CoderID == coderId && p.ObjectID == lp.LessonID && p.ObjectType == ProgressObjectType.Lesson);

                if (progress == null)
                {
                    progress = new Progress
                    {
                        CoderID = coderId,
                        ObjectID = lp.LessonID,
                        ObjectType = ProgressObjectType.Lesson,
                        Percent = percent,
                        LastUpdated = DateTime.UtcNow
                    };
                    _context.Progresses.Add(progress);
                }
                else
                {
                    progress.Percent = percent;
                    progress.LastUpdated = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task UpdateCourseProgressAsync(int coderId, int courseId)
        {
            // Lấy tất cả ProblemID thuộc course
            var problemIds = await _context.Courses
                .Where(c => c.CourseID == courseId)
                .SelectMany(c => c.Topics)
                .SelectMany(t => t.Lessons)
                .SelectMany(l => l.LessonProblems)
                .Select(lp => lp.ProblemID)
                .Distinct()
                .ToListAsync();

            var totalProblems = problemIds.Count;

            // Đếm số problem đã solve trong tập đó
            var solvedCount = await _context.Solved
                .CountAsync(s => s.CoderID == coderId && problemIds.Contains(s.ProblemID));

            double percent = totalProblems == 0 ? 0 : (double)solvedCount / totalProblems * 100;

            // Cập nhật hoặc tạo mới progress cho course
            var progress = await _context.Progresses
                .FirstOrDefaultAsync(p => p.CoderID == coderId && p.ObjectID == courseId && p.ObjectType == ProgressObjectType.Course);

            if (progress == null)
            {
                progress = new Progress
                {
                    CoderID = coderId,
                    ObjectID = courseId,
                    ObjectType = ProgressObjectType.Course,
                    Percent = percent,
                    LastUpdated = DateTime.UtcNow
                };
                _context.Progresses.Add(progress);
            }
            else
            {
                progress.Percent = percent;
                progress.LastUpdated = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }


        public async Task<List<ProgressDTO>> GetCoursesProgressAsync(List<int> courseIds, int coderId)
        {
            var progresses = await _context.Progresses
                .Where(p => courseIds.Contains(p.ObjectID) &&
                            p.CoderID == coderId &&
                            p.ObjectType == ProgressObjectType.Course)
                .ToListAsync();

            // Map sang DTO, trả về mặc định 0 nếu không có progress cho khóa đó
            var result = courseIds.Select(courseId =>
            {
                var progress = progresses.FirstOrDefault(p => p.ObjectID == courseId);
                return new ProgressDTO
                {
                    ObjectID = courseId,
                    ObjectType = ProgressObjectType.Course,
                    OjectName = "Course",
                    CoderID = coderId,
                    Percent = progress?.Percent ?? 0.0,
                    LastUpdated = progress?.LastUpdated ?? DateTime.MinValue
                };
            }).ToList();

            return result;
        }

        public async Task<List<object>> GetTopicProgressSummaryAsync(int courseId, int coderId)
        {
            var topics = await _context.Topics
                .Where(t => t.CourseID == courseId)
                .Select(t => new { t.TopicID })
                .ToListAsync();

            var topicIds = topics.Select(t => t.TopicID).ToList();

            var lessons = await _context.Lessons
                .Where(l => topicIds.Contains(l.TopicID))
                .Select(l => new { l.LessonID, l.TopicID })
                .ToListAsync();

            var lessonIds = lessons.Select(l => l.LessonID).ToList();

            var completedLessons = await _context.Progresses
                .Where(p => lessonIds.Contains(p.ObjectID) &&
                            p.CoderID == coderId &&
                            p.ObjectType == ProgressObjectType.Lesson &&
                            p.Percent >= 100)
                .ToListAsync();

            var grouped = lessons
                .GroupBy(l => l.TopicID)
                .Select(g =>
                {
                    var total = g.Count();
                    var completed = g.Count(l => completedLessons.Any(p => p.ObjectID == l.LessonID));
                    return new
                    {
                        TopicID = g.Key,
                        CompletedLessons = completed,
                        TotalLessons = total
                    };
                }).ToList();

            return grouped.Cast<object>().ToList();
        }

        public async Task<List<object>> GetLessonProgressSummaryAsync(int topicId, int coderId)
        {
            var lessons = await _context.Lessons
                .Where(l => l.TopicID == topicId)
                .Select(l => new { l.LessonID })
                .ToListAsync();

            var lessonIds = lessons.Select(l => l.LessonID).ToList();

            var lessonProblems = await _context.LessonProblems
                .Where(lp => lessonIds.Contains(lp.LessonID))
                .ToListAsync();

            var problemIds = lessonProblems.Select(lp => lp.ProblemID).Distinct().ToList();

            var solved = await _context.Solved
                .Where(s => s.CoderID == coderId && problemIds.Contains(s.ProblemID))
                .ToListAsync();

            var grouped = lessonProblems
                .GroupBy(lp => lp.LessonID)
                .Select(g =>
                {
                    var total = g.Count();
                    var completed = g.Count(lp => solved.Any(s => s.ProblemID == lp.ProblemID));
                    return new
                    {
                        LessonID = g.Key,
                        CompletedProblems = completed,
                        TotalProblems = total
                    };
                }).ToList();

            return grouped.Cast<object>().ToList();
        }
    }
}
