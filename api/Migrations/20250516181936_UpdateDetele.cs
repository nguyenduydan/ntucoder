using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDetele : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_LessonProblems_LessonProblemID",
                table: "Matches");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_LessonProblems_LessonProblemID",
                table: "Matches",
                column: "LessonProblemID",
                principalTable: "LessonProblems",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Matches_LessonProblems_LessonProblemID",
                table: "Matches");

            migrationBuilder.AddForeignKey(
                name: "FK_Matches_LessonProblems_LessonProblemID",
                table: "Matches",
                column: "LessonProblemID",
                principalTable: "LessonProblems",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
