
import { useState } from 'react';

export const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  const setSubmitting = (submitting: boolean) => {
    setIsSubmitting(submitting);
  };

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
    isSubmitting,
    setSubmitting
  };
};
