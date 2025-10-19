using FluentValidation;

namespace SolarEnrollment.Api.Endpoints.CreateEnrollment;

public class CreateEnrollmentValidator : AbstractValidator<CreateEnrollmentRequest>
{
    public CreateEnrollmentValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name must be less than 100 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name must be less than 100 characters");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(200).WithMessage("Address must be less than 200 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City must be less than 100 characters");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .Length(2).WithMessage("State must be a 2-letter abbreviation");

        RuleFor(x => x.ZipCode)
            .NotEmpty().WithMessage("ZIP code is required")
            .Matches(@"^\d{5}(-\d{4})?$").WithMessage("ZIP code must be in format 12345 or 12345-6789");

        RuleFor(x => x.Utility)
            .NotEmpty().WithMessage("Utility is required")
            .Must(BeValidUtility).WithMessage("Utility must be one of: PSEG, JCPL, ACE");

        RuleFor(x => x.UtilityAccountNumber)
            .NotEmpty().WithMessage("Utility account number is required")
            .MaximumLength(50).WithMessage("Utility account number must be less than 50 characters")
            .Must((request, uan) => ValidateUan(request.Utility, uan))
            .WithMessage("Invalid utility account number format for selected utility");

        RuleFor(x => x.AssistancePrograms)
            .Must((request, programs) => ValidateAssistancePrograms(request.HasAssistanceProgram, programs))
            .WithMessage("If assistance program is selected, at least one program must be chosen");
    }

    private bool BeValidUtility(string utility)
    {
        return utility.Equals("PSEG", StringComparison.OrdinalIgnoreCase) ||
               utility.Equals("JCPL", StringComparison.OrdinalIgnoreCase) ||
               utility.Equals("ACE", StringComparison.OrdinalIgnoreCase);
    }

    private bool ValidateUan(string utility, string uan)
    {
        if (string.IsNullOrWhiteSpace(uan))
            return false;

        return utility.ToUpperInvariant() switch
        {
            "PSEG" => System.Text.RegularExpressions.Regex.IsMatch(uan, @"^\d{10}$"),
            "JCPL" => System.Text.RegularExpressions.Regex.IsMatch(uan, @"^\d{12}$"),
            "ACE" => true, // No validation for ACE
            _ => false
        };
    }

    private bool ValidateAssistancePrograms(bool hasAssistanceProgram, List<string>? programs)
    {
        if (!hasAssistanceProgram)
            return true;

        if (programs == null || programs.Count == 0)
            return false;

        var validPrograms = new[] { "Medicare", "SNAP" };
        return programs.All(p => validPrograms.Contains(p, StringComparer.OrdinalIgnoreCase));
    }
}

