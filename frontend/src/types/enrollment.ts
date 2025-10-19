export interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  utility: string;
  utilityAccountNumber: string;
  hasAssistanceProgram: boolean;
  assistancePrograms: string[];
}

export type UtilityType = 'PSEG' | 'JCPL' | 'ACE';
export type AssistanceProgramType = 'Medicare' | 'SNAP';
