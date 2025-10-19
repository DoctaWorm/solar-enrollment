namespace SolarEnrollment.Api.Endpoints.ValidateAddress;

public class ValidateAddressResponse
{
    public bool IsValid { get; set; }
    public string? NormalizedAddress { get; set; }
    public string? ErrorMessage { get; set; }
}

