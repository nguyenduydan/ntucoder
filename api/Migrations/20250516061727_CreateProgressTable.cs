using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class CreateProgressTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Progresses",
                columns: table => new
                {
                    ProgressID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    ObjectID = table.Column<int>(type: "int", nullable: false),
                    ObjectType = table.Column<int>(type: "int", nullable: false),
                    Percent = table.Column<double>(type: "double", nullable: false, defaultValue: 0.0),
                    LastUpdated = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Progresses", x => x.ProgressID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");


            migrationBuilder.CreateIndex(
                name: "IX_Accounts_RoleID",
                table: "Accounts",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_CoderID",
                table: "Blogs",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_BlogID",
                table: "Comments",
                column: "BlogID");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_CoderID",
                table: "Comments",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_CourseID",
                table: "Comments",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_BadgeID",
                table: "Courses",
                column: "BadgeID");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CoderID",
                table: "Courses",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CourseCategoryID",
                table: "Courses",
                column: "CourseCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_CoderID",
                table: "Enrollments",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_CourseID",
                table: "Enrollments",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_LessonProblems_LessonID",
                table: "LessonProblems",
                column: "LessonID");

            migrationBuilder.CreateIndex(
                name: "IX_LessonProblems_ProblemID",
                table: "LessonProblems",
                column: "ProblemID");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_TopicID",
                table: "Lessons",
                column: "TopicID");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_CoderID",
                table: "Matches",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_LessonProblemID",
                table: "Matches",
                column: "LessonProblemID");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemCategories_CategoryID",
                table: "ProblemCategories",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_CoderID",
                table: "Problems",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Problems_TestCompilerID",
                table: "Problems",
                column: "TestCompilerID");

            migrationBuilder.CreateIndex(
                name: "IX_Progresses_CoderID_ObjectType_ObjectID",
                table: "Progresses",
                columns: new[] { "CoderID", "ObjectType", "ObjectID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CoderID",
                table: "Reviews",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_CourseID",
                table: "Reviews",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_Solved_ProblemID",
                table: "Solved",
                column: "ProblemID");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_CoderID",
                table: "Submissions",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_CompilerID",
                table: "Submissions",
                column: "CompilerID");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_ProblemID",
                table: "Submissions",
                column: "ProblemID");

            migrationBuilder.CreateIndex(
                name: "IX_TestCases_ProblemID",
                table: "TestCases",
                column: "ProblemID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRuns_SubmissionID",
                table: "TestRuns",
                column: "SubmissionID");

            migrationBuilder.CreateIndex(
                name: "IX_TestRuns_TestCaseID",
                table: "TestRuns",
                column: "TestCaseID");

            migrationBuilder.CreateIndex(
                name: "IX_Topics_CourseID",
                table: "Topics",
                column: "CourseID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        { }
    }
}
