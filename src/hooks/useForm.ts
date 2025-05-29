import { useState } from 'react';

/**
 * Custom hook for managing form field values and onChange handlers
 * 
 * @param initialValues Initial values for the form fields
 * @returns Object with values, handleChange, and resetForm functions
 */
const useForm = <T extends Record<string, any>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  // Generic onChange handler that works with any input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types (like checkboxes)
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: fieldValue,
    }));
  };

  // Function to reset form fields to initial values or empty values
  const resetForm = (newValues?: Partial<T>) => {
    setValues((prevValues) => ({
      ...prevValues,
      ...(newValues || initialValues),
    }) as T);
  };

  // Function to update a specific field value programmatically
  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  return {
    values,
    handleChange,
    resetForm,
    setFieldValue,
  };
};

export default useForm;
