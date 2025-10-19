import { TextInput, Stack, Title } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { EnrollmentFormData } from '../../validation/enrollmentSchema';

interface Step1PersonalInfoProps {
  form: UseFormReturnType<EnrollmentFormData>;
}

export const Step1PersonalInfo = ({ form }: Step1PersonalInfoProps) => {
  return (
    <Stack gap="md">
      <Title order={3}>Personal Information</Title>
      <TextInput
        label="First Name"
        placeholder="Enter your first name"
        required
        {...form.getInputProps('firstName')}
        aria-required="true"
      />
      <TextInput
        label="Last Name"
        placeholder="Enter your last name"
        required
        {...form.getInputProps('lastName')}
        aria-required="true"
      />
    </Stack>
  );
};

