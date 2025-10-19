import { useState, useEffect } from 'react';

const DRAFT_STORAGE_KEY = 'enrollment_draft';

export interface EnrollmentDraft {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  utility?: string;
  utilityAccountNumber?: string;
  hasAssistanceProgram?: boolean;
  assistancePrograms?: string[];
}

export const useDraftStorage = () => {
  const [draft, setDraft] = useState<EnrollmentDraft>({});

  useEffect(() => {
    const storedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (storedDraft) {
      try {
        setDraft(JSON.parse(storedDraft));
      } catch (error) {
        console.error('Failed to parse draft from storage:', error);
      }
    }
  }, []);

  const saveDraft = (newDraft: Partial<EnrollmentDraft>) => {
    const updatedDraft = { ...draft, ...newDraft };
    setDraft(updatedDraft);
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedDraft));
  };

  const clearDraft = () => {
    setDraft({});
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  return {
    draft,
    saveDraft,
    clearDraft,
  };
};

