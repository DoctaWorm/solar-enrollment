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
import type { EnrollmentFormData } from '../../types/enrollment';

const TOTAL_STEPS = 4;

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
    validate: {
      firstName: (value) => (value.trim().length < 1 ? 'First name is required' : null),
      lastName: (value) => (value.trim().length < 1 ? 'Last name is required' : null),
      address: (value) => (value.trim().length < 1 ? 'Address is required' : null),
      city: (value) => (value.trim().length < 1 ? 'City is required' : null),
      state: (value) => (value.trim().length !== 2 ? 'State must be 2 letters' : null),
      zipCode: (value) => (!/^\d{5}(-\d{4})?$/.test(value) ? 'Invalid ZIP code format' : null),
      utility: (value) => (!value ? 'Utility is required' : null),
      utilityAccountNumber: (value) => {
        if (!value) return 'Utility account number is required';
        
        const utility = form.values.utility;
        if (utility === 'PSEG' && !/^\d{10}$/.test(value)) {
          return 'PSEG account number must be exactly 10 digits';
        }
        if (utility === 'JCPL' && !/^\d{12}$/.test(value)) {
          return 'JCPL account number must be exactly 12 digits';
        }
        return null;
      },
      assistancePrograms: (value) => {
        if (form.values.hasAssistanceProgram && (!value || value.length === 0)) {
          return 'Please select at least one assistance program';
        }
        return null;
      },
    },
  });

  const handleNext = () => {
    let fieldsToValidate: (keyof EnrollmentFormData)[] = [];
    
    switch (currentStep) {
      case 0:
        fieldsToValidate = ['firstName', 'lastName'];
        break;
      case 1:
        fieldsToValidate = ['address', 'city', 'state', 'zipCode'];
        break;
      case 2:
        fieldsToValidate = ['utility', 'utilityAccountNumber', 'assistancePrograms'];
        break;
      case 3:
        break;
    }

    if (currentStep < 3) {
      const validation = form.validate();
      const hasStepErrors = fieldsToValidate.some(field => validation.errors[field]);
      
      if (hasStepErrors) {
        return;
      }
    }

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
    const validation = form.validate();
    if (validation.hasErrors) {
      return;
    }

    setSubmitError(null);

    try {
      const result = await submitCreateEnrollmentAsync({
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
      
      if (result.success) {
        setSubmitSuccess(true);
        clearDraft();
        form.reset();
      } else {
        setSubmitError(result.message || 'Failed to submit enrollment');
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

