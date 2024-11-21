import { useState, useCallback, useEffect } from 'react';

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validate?: (value: any) => boolean | string;
  custom?: (value: any, formValues: any) => boolean | string;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};

export type TouchedFields<T> = {
  [K in keyof T]?: boolean;
};

export interface UseFormConfig<T> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: TouchedFields<T>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  handleChange: (name: keyof T, value: any) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, isTouched?: boolean) => void;
  resetForm: () => void;
  validateField: (name: keyof T) => string | undefined;
  validateForm: () => FormErrors<T>;
}

const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormConfig<T>): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback((name: keyof T): string | undefined => {
    const value = values[name];
    const rules = validationRules[name];

    if (!rules) return undefined;

    if (rules.required && !value) {
      return 'This field is required';
    }

    if (value) {
      if (rules.minLength && String(value).length < rules.minLength) {
        return `Minimum length is ${rules.minLength} characters`;
      }

      if (rules.maxLength && String(value).length > rules.maxLength) {
        return `Maximum length is ${rules.maxLength} characters`;
      }

      if (rules.min && Number(value) < rules.min) {
        return `Minimum value is ${rules.min}`;
      }

      if (rules.max && Number(value) > rules.max) {
        return `Maximum value is ${rules.max}`;
      }

      if (rules.pattern && !rules.pattern.test(String(value))) {
        return 'Invalid format';
      }

      if (rules.validate) {
        const result = rules.validate(value);
        if (typeof result === 'string') return result;
        if (!result) return 'Invalid value';
      }

      if (rules.custom) {
        const result = rules.custom(value, values);
        if (typeof result === 'string') return result;
        if (!result) return 'Invalid value';
      }
    }

    return undefined;
  }, [values, validationRules]);

  const validateForm = useCallback((): FormErrors<T> => {
    const newErrors: FormErrors<T> = {};
    
    Object.keys(validationRules).forEach((key) => {
      const error = validateField(key as keyof T);
      if (error) {
        newErrors[key as keyof T] = error;
      }
    });

    return newErrors;
  }, [validateField, validationRules]);

  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback((name: keyof T, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setFieldValue(name, value);
    
    if (validateOnChange) {
      const error = validateField(name);
      setFieldError(name, error || '');
    }
  }, [setFieldValue, validateOnChange, validateField, setFieldError]);

  const handleBlur = useCallback((name: keyof T) => {
    setFieldTouched(name, true);
    
    if (validateOnBlur) {
      const error = validateField(name);
      setFieldError(name, error || '');
    }
  }, [setFieldTouched, validateOnBlur, validateField, setFieldError]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const newErrors = validateForm();
    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors).length > 0;
    if (!hasErrors && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validateForm, onSubmit, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialValues]);

  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    // Validate form on mount if there are validation rules
    if (Object.keys(validationRules).length > 0) {
      const newErrors = validateForm();
      setErrors(newErrors);
    }
  }, [validationRules, validateForm]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateField,
    validateForm,
  };
};

export default useForm;
