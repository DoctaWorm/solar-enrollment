import type { NormalizedAddress } from "../types/normalizedAddress";

export const isAddressDifferent = (
    normalized: NormalizedAddress,
    userAddress: { address: string; city: string; state: string; zipCode: string }
  ): boolean => {
    return (
      normalized.street.toLowerCase() !== userAddress.address.toLowerCase() ||
      normalized.city.toLowerCase() !== userAddress.city.toLowerCase() ||
      normalized.state !== userAddress.state.toUpperCase() ||
      normalized.zip !== userAddress.zipCode
    );
  };