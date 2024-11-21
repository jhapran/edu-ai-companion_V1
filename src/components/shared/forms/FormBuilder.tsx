import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import FormField from './FormField';
import ValidationMessage from './ValidationMessage';

interface FormFieldConfig {
  id: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => boolean;
    message?: string;
  };
}

interface FormBuilderProps {
  fields: FormFieldConfig[];
  onSubmit?: (values: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  initialValues?: Record<string, any>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  initialValues = {},
  layout = 'vertical',
  className = ''
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: FormFieldConfig, value: any): string | null => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.validation) {
      const { pattern, minLength, maxLength, min, max, custom, message } = field.validation;

      if (pattern && !new RegExp(pattern).test(value)) {
        return message || 'Invalid format';
      }

      if (minLength && String(value).length < minLength) {
        return `Minimum length is ${minLength} characters`;
      }

      if (maxLength && String(value).length > maxLength) {
        return `Maximum length is ${maxLength} characters`;
      }

      if (min && Number(value) < min) {
        return `Minimum value is ${min}`;
      }

      if (max && Number(value) > max) {
        return `Maximum value is ${max}`;
      }

      if (custom && !custom(value)) {
        return message || 'Invalid value';
      }
    }

    return null;
  };

  const handleChange = (field: FormFieldConfig, value: string | boolean | number) => {
    setValues(prev => ({ ...prev, [field.id]: value }));
    
    if (touched[field.id]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field.id]: error || ''
      }));
    }
  };

  const handleBlur = (field: FormFieldConfig) => {
    setTouched(prev => ({ ...prev, [field.id]: true }));
    
    const error = validateField(field, values[field.id]);
    setErrors(prev => ({
      ...prev,
      [field.id]: error || ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, values[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouched(fields.reduce((acc, field) => ({ ...acc, [field.id]: true }), {}));

    if (!hasErrors) {
      onSubmit?.(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
    >
      <div className={`grid gap-6 ${layout === 'horizontal' ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {fields.map(field => (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id]}
            error={errors[field.id]}
            touched={touched[field.id]}
            onChange={(value: string | boolean | number) => handleChange(field, value)}
            onBlur={() => handleBlur(field)}
          />
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
          >
            {cancelLabel}
          </Button>
        )}
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default FormBuilder;
