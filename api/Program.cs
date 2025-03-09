using api.Infrashtructure.Repositories;
using api.Infrashtructure.Services;
using api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

//check connectionstring
var conString = builder.Configuration.GetConnectionString("connecString") ??
     throw new InvalidOperationException("Connection string 'connecString'" +
    " not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(conString, new MySqlServerVersion(new Version(8, 0)),
    mySqlOptions => mySqlOptions.EnableRetryOnFailure()));

//Repository
builder.Services.AddScoped<CoderRepository>();
builder.Services.AddScoped<RoleRepository>();
//Service
builder.Services.AddScoped<CoderService>();
builder.Services.AddScoped<RoleService>();
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
app.UseCors("AllowMyOrigin");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
