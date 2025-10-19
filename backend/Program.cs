using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using SolarEnrollment.Api.Data;
using SolarEnrollment.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<EnrollmentDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=enrollment.db"));

builder.Services.AddHttpClient<IAddressValidationService, AddressValidationService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.MapOpenApi();

app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.UseFastEndpoints(c =>
{
    c.Endpoints.Configurator = ep =>
    {
        var endpointName = ep.EndpointType.Name;
        
        if (endpointName.EndsWith("Endpoint"))
        {
            endpointName = endpointName.Substring(0, endpointName.Length - 8);
        }
        
        ep.Description(d => d.WithName(endpointName));
    };
});

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<EnrollmentDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();
