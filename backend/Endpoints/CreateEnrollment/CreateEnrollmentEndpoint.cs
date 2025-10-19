using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using SolarEnrollment.Api.Data;
using System.Text.Json;

namespace SolarEnrollment.Api.Endpoints.CreateEnrollment;

public class CreateEnrollmentEndpoint : Endpoint<CreateEnrollmentRequest, CreateEnrollmentResponse>
{
    private readonly EnrollmentDbContext _context;

    public CreateEnrollmentEndpoint(EnrollmentDbContext context)
    {
        _context = context;
    }

    public override void Configure()
    {
        Post("/api/enrollment");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateEnrollmentRequest req, CancellationToken ct)
    {
        var enrollment = new SolarEnrollment.Api.Data.Entities.Enrollment
        {
            FirstName = req.FirstName,
            LastName = req.LastName,
            Address = req.Address,
            City = req.City,
            State = req.State.ToUpperInvariant(),
            ZipCode = req.ZipCode,
            Utility = req.Utility.ToUpperInvariant(),
            UtilityAccountNumber = req.UtilityAccountNumber,
            HasAssistanceProgram = req.HasAssistanceProgram,
            AssistancePrograms = req.AssistancePrograms != null && req.AssistancePrograms.Count > 0
                ? JsonSerializer.Serialize(req.AssistancePrograms)
                : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync(ct);

        var response = new CreateEnrollmentResponse
        {
            EnrollmentId = enrollment.Id,
            Success = true,
            Message = "Enrollment created successfully"
        };

        await SendOkAsync(response, ct);
    }
}

