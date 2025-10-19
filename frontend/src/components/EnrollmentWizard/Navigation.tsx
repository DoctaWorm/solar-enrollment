import { Group, Button, Stack } from '@mantine/core';

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoNext: boolean;
  isSubmitting?: boolean;
}

export const Navigation = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext,
  isSubmitting = false,
}: NavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Stack gap="md">
      <Group justify="space-between" mt="xl">
        <Button
          variant="default"
          onClick={onPrevious}
          disabled={isFirstStep}
          aria-label="Go to previous step"
        >
          Back
        </Button>
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Go to next step"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canGoNext || isSubmitting}
            loading={isSubmitting}
            aria-label="Submit enrollment"
          >
            Submit Enrollment
          </Button>
        )}
      </Group>
    </Stack>
  );
};

