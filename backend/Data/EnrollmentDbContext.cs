using Microsoft.EntityFrameworkCore;
using SolarEnrollment.Api.Data.Entities;

namespace SolarEnrollment.Api.Data;

public class EnrollmentDbContext : DbContext
{
    public EnrollmentDbContext(DbContextOptions<EnrollmentDbContext> options)
        : base(options)
    {
    }

    public DbSet<Enrollment> Enrollments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AssistancePrograms).HasColumnType("TEXT");
        });
    }
}

