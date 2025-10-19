namespace SolarEnrollment.Api.Endpoints.CreateEnrollment;

public class CreateEnrollmentRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Utility { get; set; } = string.Empty;
    public string UtilityAccountNumber { get; set; } = string.Empty;
    public bool HasAssistanceProgram { get; set; }
    public List<string>? AssistancePrograms { get; set; }
}

