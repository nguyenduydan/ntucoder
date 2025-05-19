using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models;
using Microsoft.EntityFrameworkCore;
using api.Infrashtructure.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;
using api.Infrashtructure.Helpers;

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
    // ✅ Cấu hình đọc token từ cookie
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Cookies["token"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

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
builder.Services.AddScoped<ProgressRepository>();
builder.Services.AddScoped<CommentRepository>();
builder.Services.AddScoped<BlogRepository>();
builder.Services.AddScoped<AccountRepository>();
//Service
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<MinioService>();
//Helpers
builder.Services.AddSingleton<EmailHelper>();

//Server
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();


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
app.UseHttpsRedirection();
app.UseCors("AllowMyOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapControllers();

app.Run();
