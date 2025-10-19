import { Stack, Title, Text, Paper, Group, Badge, Divider } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { EnrollmentFormData } from '../../validation/enrollmentSchema';

interface Step4SummaryProps {
  form: UseFormReturnType<EnrollmentFormData>;
}

export const Step4Summary = ({ form }: Step4SummaryProps) => {
  const { 
    firstName, 
    lastName, 
    address, 
    city, 
    state, 
    zipCode, 
    utility, 
    utilityAccountNumber,
    hasAssistanceProgram,
    assistancePrograms 
  } = form.values;

  return (
    <Stack gap="xl">
      <Title order={3}>Review Your Enrollment</Title>
      <Text size="sm" c="dimmed">
        Please review your information below. Click "Submit Enrollment" to complete your enrollment.
      </Text>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={4} mb="md">Personal Information</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600}>Name:</Text>
            <Text>{firstName} {lastName}</Text>
          </Group>
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={4} mb="md">Address</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600}>Street:</Text>
            <Text>{address}</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>City:</Text>
            <Text>{city}</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>State:</Text>
            <Text>{state}</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>ZIP Code:</Text>
            <Text>{zipCode}</Text>
          </Group>
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={4} mb="md">Utility Information</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600}>Provider:</Text>
            <Badge color="blue" size="lg">{utility}</Badge>
          </Group>
          <Group justify="space-between">
            <Text fw={600}>Account Number:</Text>
            <Text>{utilityAccountNumber}</Text>
          </Group>
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder>
        <Title order={4} mb="md">Assistance Programs</Title>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fw={600}>Participating in Assistance Programs:</Text>
            <Badge color={hasAssistanceProgram ? 'green' : 'gray'} size="lg">
              {hasAssistanceProgram ? 'Yes' : 'No'}
            </Badge>
          </Group>
          {hasAssistanceProgram && assistancePrograms && assistancePrograms.length > 0 && (
            <>
              <Divider my="xs" />
              <Group gap="xs">
                <Text fw={600}>Programs:</Text>
                {assistancePrograms.map((program) => (
                  <Badge key={program} color="teal" size="md">{program}</Badge>
                ))}
              </Group>
            </>
          )}
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md" withBorder bg="blue.0">
        <Text size="sm" c="dimmed">
          By submitting this enrollment, you confirm that all information provided is accurate and complete.
        </Text>
      </Paper>
    </Stack>
  );
};

