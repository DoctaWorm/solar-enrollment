namespace SolarEnrollment.Api.Services;

public interface IAddressValidationService
{
    Task<AddressValidationResult> ValidateAddressAsync(string street, string city, string state, string zip);
}

public class AddressValidationResult
{
    public bool IsValid { get; set; }
    public string? NormalizedAddress { get; set; }
    public string? ErrorMessage { get; set; }
}

