using FluentValidation;

namespace SolarEnrollment.Api.Endpoints.ValidateAddress;

public class ValidateAddressValidator : AbstractValidator<ValidateAddressRequest>
{
    public ValidateAddressValidator()
    {
        RuleFor(x => x.Street)
            .NotEmpty().WithMessage("Street address is required")
            .MaximumLength(200).WithMessage("Street address must be less than 200 characters");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(100).WithMessage("City must be less than 100 characters");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State is required")
            .Length(2).WithMessage("State must be a 2-letter abbreviation");

        RuleFor(x => x.Zip)
            .NotEmpty().WithMessage("ZIP code is required")
            .Matches(@"^\d{5}(-\d{4})?$").WithMessage("ZIP code must be in format 12345 or 12345-6789");
    }
}

