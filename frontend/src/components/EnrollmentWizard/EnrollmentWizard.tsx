import { Container, Paper, Title, Alert } from '@mantine/core';
import { Navigation } from './Navigation';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2Address } from './Step2Address';
import { Step3UtilityAndAssistance } from './Step3UtilityAndAssistance';
import { Step4Summary } from './Step4Summary';
import { StepIndicator } from './StepIndicator';
import { useDraftStorage } from '../../hooks/useDraftStorage';
import { useForm } from '@mantine/form';
import { useSolarEnrollmentApiEndpointsCreateEnrollmentCreateEnrollmentEndpoint } from '../../api/solarenrollment-api/solarenrollment-api';
import { useState } from 'react';
import type { EnrollmentFormData } from '../../validation/enrollmentSchema';
import { EnrollmentFormSchema, Step1Schema, Step2Schema, Step3Schema } from '../../validation/enrollmentSchema';
import type { ZodError } from 'zod';

const TOTAL_STEPS = 4;

const zodErrorsToFormErrors = (error: ZodError): Record<string, string> => {
  const formErrors: Record<string, string> = {};
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    formErrors[path] = err.message;
  });
  return formErrors;
};

export const EnrollmentWizard = () => {
  const { draft, saveDraft, clearDraft } = useDraftStorage();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { mutateAsync: submitCreateEnrollmentAsync, isPending } = useSolarEnrollmentApiEndpointsCreateEnrollmentCreateEnrollmentEndpoint();

  const form = useForm<EnrollmentFormData>({
    initialValues: {
      firstName: draft.firstName || '',
      lastName: draft.lastName || '',
      address: draft.address || '',
      city: draft.city || '',
      state: draft.state || '',
      zipCode: draft.zipCode || '',
      utility: draft.utility || '',
      utilityAccountNumber: draft.utilityAccountNumber || '',
      hasAssistanceProgram: draft.hasAssistanceProgram || false,
      assistancePrograms: draft.assistancePrograms || [],
    },
    validate: (values) => {
      try {
        EnrollmentFormSchema.parse(values);
        return {};
      } catch (error) {
        if (error instanceof Error && 'issues' in error) {
          return zodErrorsToFormErrors(error as ZodError);
        }
        return {};
      }
    },
  });

  const handleNext = () => {
    let stepSchema;
    
    switch (currentStep) {
      case 0:
        stepSchema = Step1Schema;
        break;
      case 1:
        stepSchema = Step2Schema;
        break;
      case 2:
        stepSchema = Step3Schema;
        break;
      case 3:
        // No validation on summary step
        break;
    }

    if (currentStep < 3 && stepSchema) {
      const result = stepSchema.safeParse(form.values);
      
      if (!result.success) {
        const stepErrors = zodErrorsToFormErrors(result.error);
        form.setErrors(stepErrors);
        return;
      }
    }

    form.clearErrors();

    // Save current step data
    saveDraft(form.values);

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const result = EnrollmentFormSchema.safeParse(form.values);
    
    if (!result.success) {
      form.setErrors(zodErrorsToFormErrors(result.error));
      return;
    }

    setSubmitError(null);

    try {
      const submissionResult = await submitCreateEnrollmentAsync({
        data: {
          firstName: form.values.firstName,
          lastName: form.values.lastName,
          address: form.values.address,
          city: form.values.city,
          state: form.values.state,
          zipCode: form.values.zipCode,
          utility: form.values.utility,
          utilityAccountNumber: form.values.utilityAccountNumber,
          hasAssistanceProgram: form.values.hasAssistanceProgram,
          assistancePrograms: form.values.assistancePrograms,
        },
      });
      
      if (submissionResult.success) {
        setSubmitSuccess(true);
        clearDraft();
        form.reset();
      } else {
        setSubmitError(submissionResult.message || 'Failed to submit enrollment');
      }
    } catch (error) {
      setSubmitError('An error occurred while submitting your enrollment. Please try again.');
      console.error('Enrollment submission error:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1PersonalInfo form={form} />;
      case 1:
        return <Step2Address form={form} />;
      case 2:
        return <Step3UtilityAndAssistance form={form} />;
      case 3:
        return <Step4Summary form={form} />;
      default:
        return null;
    }
  };

  if (submitSuccess) {
    return (
      <Container size="sm" py="xl">
        <Paper shadow="md" p="xl" radius="md">
          <Title order={2} mb="md" ta="center">
            Enrollment Successful!
          </Title>
          <Alert color="green" title="Thank You">
            Your enrollment has been submitted successfully. We will contact you soon with next steps.
          </Alert>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={1} mb="xl" ta="center">
          Solar Enrollment
        </Title>

        {submitError && (
          <Alert color="red" title="Error" mb="md">
            {submitError}
          </Alert>
        )}

        <StepIndicator active={currentStep} />

        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          {renderStep()}
        </div>

        <Navigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          canGoNext={true}
          isSubmitting={isPending}
        />
      </Paper>
    </Container>
  );
};

