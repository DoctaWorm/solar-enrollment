import { Stepper } from '@mantine/core';

interface StepIndicatorProps {
  active: number;
}

export const StepIndicator = ({ active }: StepIndicatorProps) => {
  return (
    <Stepper active={active}>
      <Stepper.Step label="Personal Info" description="Name" />
      <Stepper.Step label="Address" description="Location" />
      <Stepper.Step label="Utility & Assistance" description="Account & Programs" />
      <Stepper.Step label="Review" description="Summary" />
    </Stepper>
  );
};

