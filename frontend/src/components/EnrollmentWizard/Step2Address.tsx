import { TextInput, Stack, Title, Alert, Loader, Modal, Button, Group, Text } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { EnrollmentFormData } from '../../types/enrollment';
import { useState } from 'react';
import { useSolarEnrollmentApiEndpointsValidateAddressValidateAddressEndpoint } from '../../api/solarenrollment-api/solarenrollment-api';

interface Step2AddressProps {
  form: UseFormReturnType<EnrollmentFormData>;
  onAddressValidated?: (isValid: boolean, message?: string) => void;
}

interface NormalizedAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export const Step2Address = ({ form, onAddressValidated }: Step2AddressProps) => {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showNormalizedModal, setShowNormalizedModal] = useState(false);
  const [normalizedAddress, setNormalizedAddress] = useState<NormalizedAddress | null>(null);
  
  const { mutateAsync: validateAddressAsync, isPending } = useSolarEnrollmentApiEndpointsValidateAddressValidateAddressEndpoint();

  const handleZipBlur = async () => {
    const { address, city, state, zipCode } = form.values;
    
    if (!address || !city || !state || !zipCode) {
      return;
    }

    setValidationMessage(null);

    try {
      const result = await validateAddressAsync({
        data: {
          street: address,
          city,
          state,
          zip: zipCode,
        },
      });

      if (result.isValid && result.normalizedAddress) {
        // Parse the normalized address
        const parts = result.normalizedAddress.split(',').map(p => p.trim());
        if (parts.length >= 4) {
          const normalized = {
            street: parts[0],
            city: parts[1],
            state: parts[2],
            zip: parts[3],
          };
          
          // Check if the normalized address differs from what the user entered
          const isDifferent = 
            normalized.street.toLowerCase() !== address.toLowerCase() ||
            normalized.city.toLowerCase() !== city.toLowerCase() ||
            normalized.state !== state.toUpperCase() ||
            normalized.zip !== zipCode;
          
          if (isDifferent) {
            // Show modal asking if they want to use the normalized address returned rom the API
            setNormalizedAddress(normalized);
            setShowNormalizedModal(true);
          } else {
            setValidationMessage(`✓ Address validated`);
            onAddressValidated?.(true, result.normalizedAddress);
          }
        } else {
          setValidationMessage(`✓ Address validated`);
          onAddressValidated?.(true, result.normalizedAddress);
        }
      } else if (result.isValid) {
        setValidationMessage(`✓ Address validated`);
        onAddressValidated?.(true);
      } else {
        setValidationMessage(`⚠ ${result.errorMessage || 'Address could not be validated'}`);
        onAddressValidated?.(false, result.errorMessage || undefined);
      }
    } catch (error) {
      setValidationMessage('⚠ Unable to validate address at this time');
      onAddressValidated?.(false);
    }
  };

  const handleUseNormalizedAddress = () => {
    if (normalizedAddress) {
      form.setValues({
        address: normalizedAddress.street,
        city: normalizedAddress.city,
        state: normalizedAddress.state,
        zipCode: normalizedAddress.zip,
      });
      setValidationMessage(`✓ Address updated to: ${normalizedAddress.street}, ${normalizedAddress.city}, ${normalizedAddress.state} ${normalizedAddress.zip}`);
      onAddressValidated?.(true, `${normalizedAddress.street}, ${normalizedAddress.city}, ${normalizedAddress.state} ${normalizedAddress.zip}`);
    }
    setShowNormalizedModal(false);
    setNormalizedAddress(null);
  };

  const handleKeepOriginalAddress = () => {
    setValidationMessage(`✓ Using your entered address`);
    onAddressValidated?.(true);
    setShowNormalizedModal(false);
    setNormalizedAddress(null);
  };

  return (
    <>
      <Modal
        opened={showNormalizedModal}
        onClose={handleKeepOriginalAddress}
        title="Address Found"
        centered
        aria-labelledby="address-modal-title"
        aria-describedby="address-modal-description"
      >
        <Stack gap="md">
          <Text id="address-modal-description">
            We found a normalized version of your address. Would you like to use it?
          </Text>
          
          <Alert color="blue" title="Your Address">
            {form.values.address}, {form.values.city}, {form.values.state} {form.values.zipCode}
          </Alert>
          
          <Alert color="green" title="Normalized Address">
            {normalizedAddress?.street}, {normalizedAddress?.city}, {normalizedAddress?.state} {normalizedAddress?.zip}
          </Alert>
          
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={handleKeepOriginalAddress}
              aria-label="Keep my original address"
            >
              Keep Mine
            </Button>
            <Button
              onClick={handleUseNormalizedAddress}
              aria-label="Use normalized address"
            >
              Use This One
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Stack gap="md">
        <Title order={3}>Address Information</Title>
        <TextInput
          label="Street Address"
          placeholder="Enter your street address"
          required
          {...form.getInputProps('address')}
          aria-required="true"
        />
        <TextInput
          label="City"
          placeholder="Enter your city"
          required
          {...form.getInputProps('city')}
          aria-required="true"
        />
        <TextInput
          label="State"
          placeholder="Enter 2-letter state code (e.g., NY)"
          required
          maxLength={2}
          {...form.getInputProps('state')}
          aria-required="true"
          style={{ textTransform: 'uppercase' }}
        />
        <TextInput
          label="ZIP Code"
          placeholder="Enter your ZIP code"
          required
          {...form.getInputProps('zipCode')}
          onBlur={handleZipBlur}
          aria-required="true"
        />
        {isPending && <Loader size="sm" />}
        {validationMessage && (
          <Alert color={validationMessage.startsWith('✓') ? 'green' : 'yellow'}>
            {validationMessage}
          </Alert>
        )}
      </Stack>
    </>
  );
};

