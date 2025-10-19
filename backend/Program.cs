using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using SolarEnrollment.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EnrollmentDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=enrollment.db"));

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<EnrollmentDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();