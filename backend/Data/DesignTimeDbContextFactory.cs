using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SolarEnrollment.Api.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<EnrollmentDbContext>
{
    public EnrollmentDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<EnrollmentDbContext>();
        optionsBuilder.UseSqlite("Data Source=enrollment.db");

        return new EnrollmentDbContext(optionsBuilder.Options);
    }
}

