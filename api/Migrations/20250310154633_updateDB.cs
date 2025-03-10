using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class updateDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Cousres_CourseID",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Cousres_Badges_BadgeID",
                table: "Cousres");

            migrationBuilder.DropForeignKey(
                name: "FK_Cousres_Coders_CoderID",
                table: "Cousres");

            migrationBuilder.DropForeignKey(
                name: "FK_Cousres_CourseCategories_CourseCategoryID",
                table: "Cousres");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_Cousres_CourseID",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Cousres_CourseID",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Topics_Cousres_CourseID",
                table: "Topics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Cousres",
                table: "Cousres");

            migrationBuilder.RenameTable(
                name: "Cousres",
                newName: "Courses");

            migrationBuilder.RenameIndex(
                name: "IX_Cousres_CourseCategoryID",
                table: "Courses",
                newName: "IX_Courses_CourseCategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_Cousres_CoderID",
                table: "Courses",
                newName: "IX_Courses_CoderID");

            migrationBuilder.RenameIndex(
                name: "IX_Cousres_BadgeID",
                table: "Courses",
                newName: "IX_Courses_BadgeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Courses",
                table: "Courses",
                column: "CourseID");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Courses_CourseID",
                table: "Comments",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Badges_BadgeID",
                table: "Courses",
                column: "BadgeID",
                principalTable: "Badges",
                principalColumn: "BadgeID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_Coders_CoderID",
                table: "Courses",
                column: "CoderID",
                principalTable: "Coders",
                principalColumn: "CoderID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Courses_CourseCategories_CourseCategoryID",
                table: "Courses",
                column: "CourseCategoryID",
                principalTable: "CourseCategories",
                principalColumn: "CourseCategoryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_Courses_CourseID",
                table: "Enrollment",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Courses_CourseID",
                table: "Reviews",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_Courses_CourseID",
                table: "Topics",
                column: "CourseID",
                principalTable: "Courses",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_Courses_CourseID",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Badges_BadgeID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_Coders_CoderID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Courses_CourseCategories_CourseCategoryID",
                table: "Courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Enrollment_Courses_CourseID",
                table: "Enrollment");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Courses_CourseID",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Topics_Courses_CourseID",
                table: "Topics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Courses",
                table: "Courses");

            migrationBuilder.RenameTable(
                name: "Courses",
                newName: "Cousres");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_CourseCategoryID",
                table: "Cousres",
                newName: "IX_Cousres_CourseCategoryID");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_CoderID",
                table: "Cousres",
                newName: "IX_Cousres_CoderID");

            migrationBuilder.RenameIndex(
                name: "IX_Courses_BadgeID",
                table: "Cousres",
                newName: "IX_Cousres_BadgeID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Cousres",
                table: "Cousres",
                column: "CourseID");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_Cousres_CourseID",
                table: "Comments",
                column: "CourseID",
                principalTable: "Cousres",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Cousres_Badges_BadgeID",
                table: "Cousres",
                column: "BadgeID",
                principalTable: "Badges",
                principalColumn: "BadgeID",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Cousres_Coders_CoderID",
                table: "Cousres",
                column: "CoderID",
                principalTable: "Coders",
                principalColumn: "CoderID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Cousres_CourseCategories_CourseCategoryID",
                table: "Cousres",
                column: "CourseCategoryID",
                principalTable: "CourseCategories",
                principalColumn: "CourseCategoryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Enrollment_Cousres_CourseID",
                table: "Enrollment",
                column: "CourseID",
                principalTable: "Cousres",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Cousres_CourseID",
                table: "Reviews",
                column: "CourseID",
                principalTable: "Cousres",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_Cousres_CourseID",
                table: "Topics",
                column: "CourseID",
                principalTable: "Cousres",
                principalColumn: "CourseID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
