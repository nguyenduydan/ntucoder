using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class updatedb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    MatchID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    LessonProblemID = table.Column<int>(type: "int", nullable: false),
                    Point = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.MatchID);
                    table.ForeignKey(
                        name: "FK_Matches_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Matches_LessonProblems_LessonProblemID",
                        column: x => x.LessonProblemID,
                        principalTable: "LessonProblems",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_CoderID",
                table: "Matches",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Matches_LessonProblemID",
                table: "Matches",
                column: "LessonProblemID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Matches");
        }
    }
}
