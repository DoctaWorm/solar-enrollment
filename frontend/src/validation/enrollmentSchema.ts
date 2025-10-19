import { z } from 'zod';

// Define utility and assistance program types
export const UtilityTypeSchema = z.enum(['PSEG', 'JCPL', 'ACE']);
export const AssistanceProgramTypeSchema = z.enum(['Medicare', 'SNAP']);

// Base enrollment schema
export const EnrollmentFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .refine((val) => val.trim().length > 0, 'First name is required'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .refine((val) => val.trim().length > 0, 'Last name is required'),
  address: z
    .string()
    .min(1, 'Address is required')
    .refine((val) => val.trim().length > 0, 'Address is required'),
  city: z
    .string()
    .min(1, 'City is required')
    .refine((val) => val.trim().length > 0, 'City is required'),
  state: z
    .string()
    .length(2, 'State must be 2 letters')
    .regex(/^[A-Z]{2}$/i, 'State must be 2 letters'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  utility: z
    .string()
    .min(1, 'Utility is required'),
  utilityAccountNumber: z
    .string()
    .min(1, 'Utility account number is required'),
  hasAssistanceProgram: z.boolean(),
  assistancePrograms: z.array(z.string()),
}).refine(
  (data) => {
    // Validate utility account number based on utility type
    if (!data.utilityAccountNumber) return true;
    
    if (data.utility === 'PSEG' && !/^\d{10}$/.test(data.utilityAccountNumber)) {
      return false;
    }
    if (data.utility === 'JCPL' && !/^\d{12}$/.test(data.utilityAccountNumber)) {
      return false;
    }
    return true;
  },
  {
    message: 'Invalid utility account number format',
    path: ['utilityAccountNumber'],
  }
).refine(
  (data) => {
    // If hasAssistanceProgram is true, must select at least one program
    if (data.hasAssistanceProgram && (!data.assistancePrograms || data.assistancePrograms.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select at least one assistance program',
    path: ['assistancePrograms'],
  }
);

// Step-specific schemas for progressive validation
export const Step1Schema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .refine((val) => val.trim().length > 0, 'First name is required'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .refine((val) => val.trim().length > 0, 'Last name is required'),
});

export const Step2Schema = z.object({
  address: z
    .string()
    .min(1, 'Address is required')
    .refine((val) => val.trim().length > 0, 'Address is required'),
  city: z
    .string()
    .min(1, 'City is required')
    .refine((val) => val.trim().length > 0, 'City is required'),
  state: z
    .string()
    .length(2, 'State must be 2 letters')
    .regex(/^[A-Z]{2}$/i, 'State must be 2 letters'),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
});

export const Step3Schema = z.object({
  utility: z
    .string()
    .min(1, 'Utility is required'),
  utilityAccountNumber: z
    .string()
    .min(1, 'Utility account number is required'),
  hasAssistanceProgram: z.boolean(),
  assistancePrograms: z.array(z.string()),
}).refine(
  (data) => {
    // Validate utility account number based on utility type
    if (!data.utilityAccountNumber) return true;
    
    if (data.utility === 'PSEG' && !/^\d{10}$/.test(data.utilityAccountNumber)) {
      return false;
    }
    if (data.utility === 'JCPL' && !/^\d{12}$/.test(data.utilityAccountNumber)) {
      return false;
    }
    return true;
  },
  {
    message: 'Invalid utility account number format',
    path: ['utilityAccountNumber'],
  }
).refine(
  (data) => {
    // If hasAssistanceProgram is true, must select at least one program
    if (data.hasAssistanceProgram && (!data.assistancePrograms || data.assistancePrograms.length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Please select at least one assistance program',
    path: ['assistancePrograms'],
  }
);

// Infer TypeScript types from schemas
export type EnrollmentFormData = z.infer<typeof EnrollmentFormSchema>;
export type UtilityType = z.infer<typeof UtilityTypeSchema>;
export type AssistanceProgramType = z.infer<typeof AssistanceProgramTypeSchema>;

