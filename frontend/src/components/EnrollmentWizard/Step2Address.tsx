import { TextInput, Stack, Title, Alert, Loader, Modal, Button, Group, Text } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import type { EnrollmentFormData } from '../../validation/enrollmentSchema';
import { useState } from 'react';
import { useSolarEnrollmentApiEndpointsValidateAddressValidateAddressEndpoint } from '../../api/solarenrollment-api/solarenrollment-api';
import type { NormalizedAddress } from './types/normalizedAddress';
import { isAddressDifferent } from './utility/isAddressDifferent';

interface Step2AddressProps {
  form: UseFormReturnType<EnrollmentFormData>;
  onAddressValidated?: (isValid: boolean, message?: string) => void;
}

export const Step2Address = ({ form, onAddressValidated }: Step2AddressProps) => {
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [showNormalizedModal, setShowNormalizedModal] = useState(false);
  const [normalizedAddress, setNormalizedAddress] = useState<NormalizedAddress | null>(null);
  
  const { mutateAsync: validateAddressAsync, isPending } = useSolarEnrollmentApiEndpointsValidateAddressValidateAddressEndpoint();

  const parseNormalizedAddress = (normalizedAddressString: string): NormalizedAddress | null => {
    const address = normalizedAddressString.split(',').map(p => p.trim());
    if (address.length < 4) return null;
    
    return {
      street: address[0],
      city: address[1],
      state: address[2],
      zip: address[3],
    };
  };

  const handleValidationSuccess = (
    normalizedAddressString: string,
    userAddress: { address: string; city: string; state: string; zipCode: string }
  ) => {
    const normalized = parseNormalizedAddress(normalizedAddressString);
    
    if (!normalized) {
      setValidationMessage(`✓ Address validated`);
      onAddressValidated?.(true, normalizedAddressString);
      return;
    }
    
    if (isAddressDifferent(normalized, userAddress)) {
      setNormalizedAddress(normalized);
      setShowNormalizedModal(true);
      return;
    }
    
    setValidationMessage(`✓ Address validated`);
    onAddressValidated?.(true, normalizedAddressString);
  };

  const handleZipBlur = async () => {
    const { address, city, state, zipCode } = form.values;
    
    if (!address || !city || !state || !zipCode) {
      return;
    }

    setValidationMessage(null);

    try {
      const result = await validateAddressAsync({
        data: { street: address, city, state, zip: zipCode },
      });

      if (!result.isValid) {
        setValidationMessage(`⚠ ${result.errorMessage || 'Address could not be validated'}`);
        onAddressValidated?.(false, result.errorMessage || undefined);
        return;
      }

      if (!result.normalizedAddress) {
        setValidationMessage(`✓ Address validated`);
        onAddressValidated?.(true);
        return;
      }

      handleValidationSuccess(result.normalizedAddress, { address, city, state, zipCode });
      
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

