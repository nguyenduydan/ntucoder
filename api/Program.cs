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
    options.AddPolicy("AllowAll", builder =>
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

builder.Services.AddScoped<ICoderRepo, CoderRepo>();
builder.Services.AddScoped<ICoderService, CoderService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAll");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
