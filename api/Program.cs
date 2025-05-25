using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Reflection;
using DotNetEnv;

using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models;
using api.Infrashtructure.Middlewares;
using api.Infrashtructure.Helpers;
using api.Infrastructure.Helpers;


// 1. Load biến môi trường từ file .env (ở root project)
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// 2. Load config file json + biến môi trường (env sẽ ghi đè json nếu trùng key)
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// 3. Truy cập config từ IConfiguration (KHÔNG cần dùng Environment.GetEnvironmentVariable nữa)
var config = builder.Configuration;

var secretKey = config["JwtSettings:SecretKey"];
if (string.IsNullOrEmpty(secretKey))
{
    throw new Exception("JwtSettings:SecretKey not found");
}

var issuer = config["JwtSettings:Issuer"] ?? "ntucoder";
var audience = config["JwtSettings:Audience"] ?? "ntucoder-frontend";

var googleClientId = config["GoogleAuthSettings:ClientId"];
var googleClientSecret = config["GoogleAuthSettings:ClientSecret"];

// Mail Setting
var email = config["Smtp:User"];
var password = config["Smtp:Pass"];
var host = config["Smtp:Host"];
var from = config["Smtp:From"];
var port = int.Parse(config["Smtp:Port"] ?? "587");

// 4. Đăng ký dịch vụ Authentication JWT
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
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
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

// 5. Các service, middleware khác
builder.Services.AddAuthorization();
builder.Services.AddControllers();
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
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

var allowedOrigins = new[] {
    "https://ntucoder.vercel.app",
    "https://ntucoder-nguyenduydans-projects.vercel.app",
     "http://localhost:3000",
};


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", builder =>
    {
        builder.WithOrigins(allowedOrigins)
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials();
    });
});

var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING") 
    ?? throw new InvalidOperationException("Connection string 'DB_CONNECTION_STRING'not found.");

var connectionLocal = builder.Configuration.GetConnectionString("connecString") ??
    throw new InvalidOperationException("Connection string ''connecString' not found.");

builder.Services.AddDbContextFactory<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0)),
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
builder.Services.AddScoped<SearchAllService>();

//Service
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<MinioService>();
//Helpers
builder.Services.AddScoped<EmailHelper>();

//Server
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

// Middleware pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Use(async (context, next) =>
{
    if (app.Environment.IsProduction() &&
        context.Request.Path.StartsWithSegments("/swagger"))
    {
        context.Response.StatusCode = 404;
        await context.Response.WriteAsync("Not found");
        return;
    }
    await next();
});


if (app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
app.UseCors("AllowMyOrigin");

app.UseAuthentication();
app.UseAuthorization();

//app.UseMiddleware<IpMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapControllers();

app.Run();