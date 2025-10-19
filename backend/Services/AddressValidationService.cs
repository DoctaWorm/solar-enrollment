using System.Text.Json;

namespace SolarEnrollment.Api.Services;
public class AddressValidationService : IAddressValidationService
{
    private readonly HttpClient _httpClient;
    private const string CensusGeocodingApiUrl = "https://geocoding.geo.census.gov/geocoder/locations/address";

    public AddressValidationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<AddressValidationResult> ValidateAddressAsync(string street, string city, string state, string zip)
    {
        try
        {
            var requestUrl = $"{CensusGeocodingApiUrl}?street={Uri.EscapeDataString(street)}&city={Uri.EscapeDataString(city)}&state={Uri.EscapeDataString(state)}&zip={Uri.EscapeDataString(zip)}&benchmark=Public_AR_Current&format=json";

            var response = await _httpClient.GetAsync(requestUrl);
            
            if (!response.IsSuccessStatusCode)
            {
                return new AddressValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "Unable to validate address at this time"
                };
            }

            var content = await response.Content.ReadAsStringAsync();
            var jsonDoc = JsonDocument.Parse(content);

            var result = jsonDoc.RootElement.GetProperty("result");
            var addressMatches = result.GetProperty("addressMatches");

            if (addressMatches.GetArrayLength() > 0)
            {
                var firstMatch = addressMatches[0];
                var matchedAddress = firstMatch.GetProperty("matchedAddress").GetString();

                return new AddressValidationResult
                {
                    IsValid = true,
                    NormalizedAddress = matchedAddress
                };
            }

            return new AddressValidationResult
            {
                IsValid = false,
                ErrorMessage = "Address not found"
            };
        }
        catch (Exception ex)
        {
            return new AddressValidationResult
            {
                IsValid = false,
                ErrorMessage = $"Error validating address: {ex.Message}"
            };
        }
    }
}
