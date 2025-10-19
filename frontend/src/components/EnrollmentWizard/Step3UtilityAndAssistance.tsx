import { Select, TextInput, Stack, Title, Checkbox, MultiSelect } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { EnrollmentFormData, UtilityType, AssistanceProgramType } from '../../validation/enrollmentSchema';

interface Step3UtilityAndAssistanceProps {
  form: UseFormReturnType<EnrollmentFormData>;
}

const utilities: { value: UtilityType; label: string }[] = [
  { value: 'PSEG', label: 'PSEG' },
  { value: 'JCPL', label: 'JCPL' },
  { value: 'ACE', label: 'ACE' },
];

const assistancePrograms: { value: AssistanceProgramType; label: string }[] = [
  { value: 'Medicare', label: 'Medicare' },
  { value: 'SNAP', label: 'SNAP' },
];

export const Step3UtilityAndAssistance = ({ form }: Step3UtilityAndAssistanceProps) => {
  const utility = form.values.utility as UtilityType;
  const hasAssistance = form.values.hasAssistanceProgram;

  return (
    <Stack gap="xl">
      <Title order={3}>Utility & Assistance Information</Title>
      
      <Stack gap="md">
        <Title order={4}>Utility Provider</Title>
        <Select
          label="Utility Provider"
          placeholder="Select your utility provider"
          required
          data={utilities}
          {...form.getInputProps('utility')}
          aria-required="true"
        />
        <TextInput
          label="Utility Account Number"
          placeholder={
            utility === 'PSEG'
              ? 'Enter 10-digit account number'
              : utility === 'JCPL'
              ? 'Enter 12-digit account number'
              : 'Enter your account number'
          }
          required
          {...form.getInputProps('utilityAccountNumber')}
          aria-required="true"
          aria-describedby={utility ? `uan-help-${utility}` : undefined}
        />
        {utility && (
          <div id={`uan-help-${utility}`} style={{ fontSize: '0.875rem', color: '#666' }}>
            {utility === 'PSEG' && 'PSEG account numbers are 10 digits long'}
            {utility === 'JCPL' && 'JCPL account numbers are 12 digits long'}
            {utility === 'ACE' && 'Enter your ACE account number'}
          </div>
        )}
      </Stack>

      <Stack gap="md">
        <Title order={4}>Assistance Programs</Title>
        <Checkbox
          label="I participate in an assistance program"
          {...form.getInputProps('hasAssistanceProgram', { type: 'checkbox' })}
          size={'xl'}
        />
        {hasAssistance && (
          <MultiSelect
            label="Select Programs"
            placeholder="Select all that apply"
            data={assistancePrograms}
            {...form.getInputProps('assistancePrograms')}
            aria-required="true"
            mt="sm"
            searchable
            clearable
            withAsterisk
          />
        )}
      </Stack>
    </Stack>
  );
};

