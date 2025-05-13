using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.Infrashtructure.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

// Đọc cấu hình JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme,
        }
    };
    options.AddSecurityDefinition("Bearer", jwtSecurityScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {jwtSecurityScheme,Array.Empty<string>() }
    });
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

//check connectionstring
var conString = builder.Configuration.GetConnectionString("connecString") ??
     throw new InvalidOperationException("Connection string 'connecString'" +
    " not found.");
builder.Services.AddDbContextFactory<ApplicationDbContext>(options =>
    options.UseMySql(conString, new MySqlServerVersion(new Version(8, 0)),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure())
    .EnableDetailedErrors(true)
    .EnableSensitiveDataLogging(false)
);

//Repository
builder.Services.AddScoped<CoderRepository>();
builder.Services.AddScoped<RoleRepository>();
builder.Services.AddScoped<BadgeRepository>();
builder.Services.AddScoped<CourseCategoryRepository>();
builder.Services.AddScoped<CourseRepository>();
builder.Services.AddScoped<TopicRepository>();
builder.Services.AddScoped<LessonRepository>();
builder.Services.AddScoped<CategoryRepository>();
builder.Services.AddScoped<CompilerRepository>();
builder.Services.AddScoped<ProblemRepository>();
builder.Services.AddScoped<SubmissionRepository>();
builder.Services.AddScoped<TestCaseRepository>();
builder.Services.AddScoped<TestRunRepository>();
builder.Services.AddScoped<CodeExecutionService>();
builder.Services.AddScoped<EnrollmentRepository>();
builder.Services.AddScoped<ReviewRepository>();
//Service
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<MinioService>();



var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseAuthentication();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowMyOrigin");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
