﻿using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class update_db : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CatName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CatOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Compilers",
                columns: table => new
                {
                    CompilerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CompilerName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CompilerPath = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CompilerOption = table.Column<int>(type: "int", nullable: false),
                    CompilerExtension = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Compilers", x => x.CompilerID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleID);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    AccountID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SaltMD5 = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PwdResetCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PwdResetDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReceiveEmail = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RoleID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.AccountID);
                    table.ForeignKey(
                        name: "FK_Accounts_Roles_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Roles",
                        principalColumn: "RoleID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Coders",
                columns: table => new
                {
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    CoderName = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CoderEmail = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Avatar = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "text", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gender = table.Column<int>(type: "int", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedBy = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coders", x => x.CoderID);
                    table.ForeignKey(
                        name: "FK_Coders_Accounts_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Accounts",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cousres",
                columns: table => new
                {
                    CourseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CourseName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cousres", x => x.CourseID);
                    table.ForeignKey(
                        name: "FK_Cousres_Accounts_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Accounts",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Blogs",
                columns: table => new
                {
                    BlogID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BlogDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Published = table.Column<int>(type: "int", nullable: false),
                    PinHome = table.Column<int>(type: "int", nullable: false),
                    CoderID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blogs", x => x.BlogID);
                    table.ForeignKey(
                        name: "FK_Blogs_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Problems",
                columns: table => new
                {
                    ProblemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProblemName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProblemCode = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TimeLimit = table.Column<float>(type: "float", nullable: true),
                    MemoryLimit = table.Column<int>(type: "int", nullable: true),
                    ProblemContent = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProblemExplanation = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TestType = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TestCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TestProgCompile = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    Published = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TestCompilerID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Problems", x => x.ProblemID);
                    table.ForeignKey(
                        name: "FK_Problems_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Problems_Compilers_TestCompilerID",
                        column: x => x.TestCompilerID,
                        principalTable: "Compilers",
                        principalColumn: "CompilerID",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Enrollment",
                columns: table => new
                {
                    EnrollmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enrollment", x => x.EnrollmentID);
                    table.ForeignKey(
                        name: "FK_Enrollment_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Enrollment_Cousres_CourseID",
                        column: x => x.CourseID,
                        principalTable: "Cousres",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    TopicID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CourseID = table.Column<int>(type: "int", nullable: false),
                    TopicName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TopicDescription = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.TopicID);
                    table.ForeignKey(
                        name: "FK_Topics_Cousres_CourseID",
                        column: x => x.CourseID,
                        principalTable: "Cousres",
                        principalColumn: "CourseID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    BlogID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    CommentTime = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CommentID);
                    table.ForeignKey(
                        name: "FK_Comments_Blogs_BlogID",
                        column: x => x.BlogID,
                        principalTable: "Blogs",
                        principalColumn: "BlogID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProblemCategories",
                columns: table => new
                {
                    ProblemID = table.Column<int>(type: "int", nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemCategories", x => new { x.ProblemID, x.CategoryID });
                    table.ForeignKey(
                        name: "FK_ProblemCategories_Categories_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "Categories",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProblemCategories_Problems_ProblemID",
                        column: x => x.ProblemID,
                        principalTable: "Problems",
                        principalColumn: "ProblemID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Solved",
                columns: table => new
                {
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    ProblemID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Solved", x => new { x.CoderID, x.ProblemID });
                    table.ForeignKey(
                        name: "FK_Solved_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Solved_Problems_ProblemID",
                        column: x => x.ProblemID,
                        principalTable: "Problems",
                        principalColumn: "ProblemID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    SubmissionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CoderID = table.Column<int>(type: "int", nullable: false),
                    CompilerID = table.Column<int>(type: "int", nullable: false),
                    ProblemID = table.Column<int>(type: "int", nullable: false),
                    TakePartID = table.Column<int>(type: "int", nullable: false),
                    SubmitTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    SubmissionCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubmissionStatus = table.Column<int>(type: "int", nullable: false),
                    TestRunCount = table.Column<int>(type: "int", nullable: true),
                    TestResult = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaxMemorySize = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MaxTimeDuration = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.SubmissionID);
                    table.ForeignKey(
                        name: "FK_Submissions_Coders_CoderID",
                        column: x => x.CoderID,
                        principalTable: "Coders",
                        principalColumn: "CoderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Submissions_Compilers_CompilerID",
                        column: x => x.CompilerID,
                        principalTable: "Compilers",
                        principalColumn: "CompilerID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Submissions_Problems_ProblemID",
                        column: x => x.ProblemID,
                        principalTable: "Problems",
                        principalColumn: "ProblemID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TestCases",
                columns: table => new
                {
                    TestCaseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ProblemID = table.Column<int>(type: "int", nullable: false),
                    TestCaseOrder = table.Column<int>(type: "int", nullable: false),
                    SampleTest = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PreTest = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Input = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Output = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestCases", x => x.TestCaseID);
                    table.ForeignKey(
                        name: "FK_TestCases_Problems_ProblemID",
                        column: x => x.ProblemID,
                        principalTable: "Problems",
                        principalColumn: "ProblemID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    LessonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TopicID = table.Column<int>(type: "int", nullable: false),
                    LessonTitle = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LessonContent = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Order = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.LessonID);
                    table.ForeignKey(
                        name: "FK_Lessons_Topics_TopicID",
                        column: x => x.TopicID,
                        principalTable: "Topics",
                        principalColumn: "TopicID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TestRuns",
                columns: table => new
                {
                    TestRunID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    SubmissionID = table.Column<int>(type: "int", nullable: false),
                    TestCaseID = table.Column<int>(type: "int", nullable: false),
                    TimeDuration = table.Column<int>(type: "int", nullable: false),
                    MemorySize = table.Column<int>(type: "int", nullable: false),
                    TestOutput = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Result = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CheckerLog = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TestRuns", x => x.TestRunID);
                    table.ForeignKey(
                        name: "FK_TestRuns_Submissions_SubmissionID",
                        column: x => x.SubmissionID,
                        principalTable: "Submissions",
                        principalColumn: "SubmissionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TestRuns_TestCases_TestCaseID",
                        column: x => x.TestCaseID,
                        principalTable: "TestCases",
                        principalColumn: "TestCaseID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LessonSubmissions",
                columns: table => new
                {
                    LessonSubmissionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    LessonID = table.Column<int>(type: "int", nullable: false),
                    SubmissionID = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Feedback = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LessonSubmissions", x => x.LessonSubmissionID);
                    table.ForeignKey(
                        name: "FK_LessonSubmissions_Lessons_LessonID",
                        column: x => x.LessonID,
                        principalTable: "Lessons",
                        principalColumn: "LessonID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LessonSubmissions_Submissions_SubmissionID",
                        column: x => x.SubmissionID,
                        principalTable: "Submissions",
                        principalColumn: "SubmissionID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleID", "Name" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "User" },
                    { 3, "Manager" }
                });

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
                name: "IX_Cousres_CreatedBy",
                table: "Cousres",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_CoderID",
                table: "Enrollment",
                column: "CoderID");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollment_CourseID",
                table: "Enrollment",
                column: "CourseID");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_TopicID",
                table: "Lessons",
                column: "TopicID");

            migrationBuilder.CreateIndex(
                name: "IX_LessonSubmissions_LessonID",
                table: "LessonSubmissions",
                column: "LessonID");

            migrationBuilder.CreateIndex(
                name: "IX_LessonSubmissions_SubmissionID",
                table: "LessonSubmissions",
                column: "SubmissionID");

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
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Enrollment");

            migrationBuilder.DropTable(
                name: "LessonSubmissions");

            migrationBuilder.DropTable(
                name: "ProblemCategories");

            migrationBuilder.DropTable(
                name: "Solved");

            migrationBuilder.DropTable(
                name: "TestRuns");

            migrationBuilder.DropTable(
                name: "Blogs");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "TestCases");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "Problems");

            migrationBuilder.DropTable(
                name: "Cousres");

            migrationBuilder.DropTable(
                name: "Coders");

            migrationBuilder.DropTable(
                name: "Compilers");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
