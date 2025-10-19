using System.ComponentModel.DataAnnotations;

namespace SolarEnrollment.Api.Data.Entities;

public class Enrollment
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(200)]
    public string Address { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string City { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(2)]
    public string State { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(10)]
    public string ZipCode { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(10)]
    public string Utility { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(50)]
    public string UtilityAccountNumber { get; set; } = string.Empty;
    
    public bool HasAssistanceProgram { get; set; }
    
    public string? AssistancePrograms { get; set; } // JSON array
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

