using api.Infrashtructure.Enums;
using api.Models.ERD;
using Microsoft.EntityFrameworkCore;
namespace api.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Coder> Coders { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Compiler> Compilers { get; set; }
        public DbSet<Problem> Problems { get; set; }
        public DbSet<ProblemCategory> ProblemCategories { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Solved> Solved { get; set; }
        public DbSet<Submission> Submissions { get; set; }
        public DbSet<TestCase> TestCases { get; set; }
        public DbSet<TestRun> TestRuns { get; set; }
        public DbSet<Course> Cousres { get; set; }
        public DbSet<Topic> Topics { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<LessonSubmission> LessonSubmissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base .OnModelCreating(modelBuilder);

            modelBuilder.Entity<Account>(entity =>
            {
                // Thiết lập khóa chính
                entity.HasKey(a => a.AccountID);

                entity.Property(a => a.UserName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(a => a.Password)
                      .IsRequired();

                entity.Property(a => a.SaltMD5)
                      .IsRequired();

                entity.Property(a => a.ReceiveEmail)
                      .HasMaxLength(100);

                entity.HasOne(a => a.Role)
                      .WithMany(r => r.Accounts)
                      .HasForeignKey(a => a.RoleID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(a => a.Coder)
                      .WithOne(c => c.Account)
                      .HasForeignKey<Coder>(c => c.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(a => a.Courses)
                      .WithOne(c => c.Creator)
                      .HasForeignKey(c => c.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Blog>(entity =>
            {
                entity.HasKey(b => b.BlogID);

                entity.Property(b => b.Title)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(b => b.BlogDate)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(b => b.Content)
                      .IsRequired();

                entity.Property(b => b.Published)
                      .IsRequired();

                entity.Property(b => b.PinHome)
                      .IsRequired();

                entity.HasOne(b => b.Coder)
                      .WithMany(c => c.Blogs)
                      .HasForeignKey(b => b.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(b => b.Comments)
                      .WithOne(c => c.Blog)
                      .HasForeignKey(c => c.BlogID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.CategoryID);
                entity.Property(c => c.CatName)
                      .IsRequired()
                      .HasMaxLength(200);
                entity.Property(c => c.CatOrder)
                      .IsRequired();
            });

            modelBuilder.Entity<Coder>(entity =>
            {
                entity.HasKey(c => c.CoderID);

                entity.Property(c => c.CoderName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(c => c.CoderEmail)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(c => c.PhoneNumber)
                      .HasMaxLength(10);

                entity.Property(c => c.Avatar)
                      .HasMaxLength(500); // Giới hạn độ dài đường dẫn avatar

                entity.Property(c => c.Description)
                      .HasColumnType("text"); // Chuyển thành kiểu TEXT nếu mô tả dài

                entity.Property(c => c.CreatedAt)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(c => c.CreatedBy)
                      .HasMaxLength(100);

                entity.Property(c => c.UpdatedAt)
                      .HasColumnType("datetime");

                entity.Property(c => c.UpdatedBy)
                      .HasMaxLength(100);

                // FK - One-to-One
                entity.HasOne(c => c.Account)
                      .WithOne(a => a.Coder)
                      .HasForeignKey<Coder>(c => c.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                // FK - One-to-Many
                entity.HasMany(c => c.Blogs)
                      .WithOne(b => b.Coder)
                      .HasForeignKey(b => b.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(c => c.Comments)
                      .WithOne(cm => cm.Coder)
                      .HasForeignKey(cm => cm.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(c => c.Submissions)
                      .WithOne(s => s.Coder)
                      .HasForeignKey(s => s.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(c => c.Solveds)
                      .WithOne(s => s.Coder)
                      .HasForeignKey(s => s.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(c => c.Enrollments)
                      .WithOne(e => e.Coder)
                      .HasForeignKey(e => e.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);
            });


            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(c => c.CommentID);

                entity.Property(c => c.Content)
                      .IsRequired();

                entity.Property(c => c.CommentTime)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.HasOne(c => c.Blog)
                      .WithMany(b => b.Comments)
                      .HasForeignKey(c => c.BlogID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(c => c.Coder)
                      .WithMany(cdr => cdr.Comments)
                      .HasForeignKey(c => c.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Compiler>(entity =>
            {
                entity.HasKey(c => c.CompilerID);

                entity.Property(c => c.CompilerName)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(c => c.CompilerPath)
                      .IsRequired()
                      .HasMaxLength(500);

                entity.Property(c => c.CompilerOption)
                      .IsRequired();

                entity.Property(c => c.CompilerExtension)
                      .HasMaxLength(50);

                entity.HasMany(c => c.Submissions)
                      .WithOne(s => s.Compiler)
                      .HasForeignKey(s => s.CompilerID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(c => c.Problems)
                      .WithOne(p => p.Compiler)
                      .HasForeignKey(p => p.TestCompilerID)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(c => c.CourseID);

                entity.Property(c => c.CourseName)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(c => c.Description);

                entity.Property(c => c.CreatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(c => c.Creator)
                      .WithMany(a => a.Courses)
                      .HasForeignKey(c => c.CreatedBy)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Enrollment>(entity =>
            {
                entity.HasKey(e => e.EnrollmentID);

                entity.Property(e => e.EnrolledAt)
                      .HasColumnType("datetime");

                entity.HasOne(e => e.Course)
                      .WithMany(c => c.Enrollments)
                      .HasForeignKey(e => e.CourseID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Coder)
                      .WithMany(c => c.Enrollments)
                      .HasForeignKey(e => e.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Lesson>(entity =>
            {
                entity.HasKey(e => e.LessonID);

                entity.Property(e => e.CreatedAt)
                     .HasColumnType("datetime");

                entity.HasOne(e => e.Topic)
                      .WithMany(t => t.Lessons)
                      .HasForeignKey(e => e.TopicID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<LessonSubmission>(entity =>
            {
                entity.HasKey(e => e.LessonSubmissionID);

                entity.Property(e => e.CreatedAt)
                     .HasColumnType("datetime");

                entity.Property(e => e.Score)
                      .HasColumnType("decimal(5,2)") // Giới hạn số thập phân
                      .IsRequired();

                entity.HasOne(e => e.Lesson)
                      .WithMany(l => l.LessonSubmissions)
                      .HasForeignKey(e => e.LessonID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Submission)
                      .WithMany(s => s.LessonSubmissions)
                      .HasForeignKey(e => e.SubmissionID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Problem>(entity =>
            {
                entity.HasKey(e => e.ProblemID);

                entity.Property(e => e.ProblemName)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(e => e.ProblemCode)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(e => e.TimeLimit);

                entity.Property(e => e.MemoryLimit);

                entity.Property(e => e.ProblemContent)
                      .IsRequired();

                entity.Property(e => e.Published)
                      .HasDefaultValue(0);

                entity.Property(e => e.TestType)
                      .IsRequired()
                      .HasMaxLength(50);

                entity.Property(e => e.TestCode)
                      .IsRequired();

                entity.Property(e => e.TestProgCompile);

                entity.HasOne(e => e.Coder)
                      .WithMany(c => c.Problems)
                      .HasForeignKey(e => e.CoderID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Compiler)
                      .WithMany(c => c.Problems)
                      .HasForeignKey(e => e.TestCompilerID)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<ProblemCategory>(entity =>
            {
                entity.HasKey(pc => new { pc.ProblemID, pc.CategoryID });

                entity.Property(pc => pc.Note)
                      .HasMaxLength(500);

                entity.HasOne(pc => pc.Problem)
                      .WithMany(p => p.ProblemCategories)
                      .HasForeignKey(pc => pc.ProblemID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pc => pc.Category)
                      .WithMany(c => c.ProblemCategories)
                      .HasForeignKey(pc => pc.CategoryID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(r => r.RoleID);

                entity.Property(r => r.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.HasMany(r => r.Accounts)
                      .WithOne(a => a.Role)
                      .HasForeignKey(a => a.RoleID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasData(
                    Enum.GetValues(typeof(RoleEnum))
                        .Cast<RoleEnum>()
                        .Select(e => new Role
                        {
                            RoleID = (int)e,
                            Name = e.ToString()
                        }).ToArray()
                );
            });


            modelBuilder.Entity<Solved>(entity =>
            {
                entity.HasKey(s => new { s.CoderID, s.ProblemID });

                entity.HasOne(s => s.Coder)
                      .WithMany(c => c.Solveds)
                      .HasForeignKey(s => s.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Problem)
                      .WithMany(p => p.Solveds)
                      .HasForeignKey(s => s.ProblemID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Submission>(entity =>
            {
                entity.HasKey(s => s.SubmissionID);

                entity.Property(s => s.SubmitTime)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(s => s.SubmissionCode)
                      .IsRequired();

                entity.Property(s => s.SubmissionStatus)
                      .IsRequired();

                entity.Property(s => s.TestRunCount);

                entity.Property(s => s.TestResult);

                entity.Property(s => s.MaxMemorySize);

                entity.Property(s => s.MaxTimeDuration);

                entity.Property(s => s.CreatedAt)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(s => s.UpdatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(s => s.Coder)
                      .WithMany(c => c.Submissions)
                      .HasForeignKey(s => s.CoderID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(s => s.Compiler)
                      .WithMany(c => c.Submissions)
                      .HasForeignKey(s => s.CompilerID)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.Problem)
                      .WithMany(p => p.Submissions)
                      .HasForeignKey(s => s.ProblemID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(s => s.TestRuns)
                      .WithOne(tr => tr.Submission)
                      .HasForeignKey(tr => tr.SubmissionID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(s => s.LessonSubmissions)
                      .WithOne(ls => ls.Submission)
                      .HasForeignKey(ls => ls.SubmissionID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TestCase>(entity =>
            {
                entity.HasKey(tc => tc.TestCaseID);

                entity.Property(tc => tc.TestCaseOrder)
                      .IsRequired();

                entity.Property(tc => tc.SampleTest);

                entity.Property(tc => tc.PreTest);

                entity.Property(tc => tc.Input)
                      .IsRequired();

                entity.Property(tc => tc.Output)
                      .IsRequired();

                entity.HasOne(tc => tc.Problem)
                      .WithMany(p => p.TestCases)
                      .HasForeignKey(tc => tc.ProblemID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(tc => tc.TestRuns)
                      .WithOne(tr => tr.TestCase)
                      .HasForeignKey(tr => tr.TestCaseID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TestRun>(entity =>
            {
                entity.HasKey(tr => tr.TestRunID);

                entity.Property(tr => tr.TimeDuration)
                      .IsRequired();

                entity.Property(tr => tr.MemorySize)
                      .IsRequired();

                entity.Property(tr => tr.TestOutput)
                      .IsRequired();

                entity.Property(tr => tr.Result)
                      .IsRequired();

                entity.Property(tr => tr.CheckerLog);

                entity.HasOne(tr => tr.Submission)
                      .WithMany(s => s.TestRuns)
                      .HasForeignKey(tr => tr.SubmissionID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(tr => tr.TestCase)
                      .WithMany(tc => tc.TestRuns)
                      .HasForeignKey(tr => tr.TestCaseID)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Topic>(entity =>
            {
                entity.HasKey(t => t.TopicID);

                entity.Property(t => t.TopicName)
                      .IsRequired()
                      .HasMaxLength(255);

                entity.Property(t => t.TopicDescription);

                entity.Property(t => t.CreatedAt)
                      .IsRequired()
                      .HasColumnType("datetime");

                entity.Property(t => t.UpdatedAt)
                      .HasColumnType("datetime");

                entity.HasOne(t => t.Course)
                      .WithMany(c => c.Topics)
                      .HasForeignKey(t => t.CourseID)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(t => t.Lessons)
                      .WithOne(l => l.Topic)
                      .HasForeignKey(l => l.TopicID)
                      .OnDelete(DeleteBehavior.Cascade);
            });


        }

    }
}
