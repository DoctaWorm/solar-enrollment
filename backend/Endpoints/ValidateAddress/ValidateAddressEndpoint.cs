using FastEndpoints;
using SolarEnrollment.Api.Services;

namespace SolarEnrollment.Api.Endpoints.ValidateAddress;

public class ValidateAddressEndpoint : Endpoint<ValidateAddressRequest, ValidateAddressResponse>
{
    private readonly IAddressValidationService _addressValidationService;

    public ValidateAddressEndpoint(IAddressValidationService addressValidationService)
    {
        _addressValidationService = addressValidationService;
    }

    public override void Configure()
    {
        Post("/api/address/validate");
        AllowAnonymous();
    }

    public override async Task HandleAsync(ValidateAddressRequest req, CancellationToken ct)
    {
        var result = await _addressValidationService.ValidateAddressAsync(
            req.Street, 
            req.City, 
            req.State, 
            req.Zip);

        var response = new ValidateAddressResponse
        {
            IsValid = result.IsValid,
            NormalizedAddress = result.NormalizedAddress,
            ErrorMessage = result.ErrorMessage
        };

        await SendOkAsync(response, ct);
    }
}

