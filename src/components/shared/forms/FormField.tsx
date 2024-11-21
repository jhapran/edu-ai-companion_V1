import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import TextArea from '../../../components/ui/TextArea';
import ValidationMessage from './ValidationMessage';

interface FieldConfig {
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

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  className = ''
}) => {
  const renderField = () => {
    const commonProps = {
      id: field.id,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(e.target.value),
      onBlur,
      placeholder: field.placeholder,
      required: field.required,
      className: `w-full ${error && touched ? 'border-red-300' : ''}`
    };

    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            options={field.options || []}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.id}
              checked={value || false}
              onChange={e => onChange(e.target.checked)}
              onBlur={onBlur}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor={field.id}
              className="ml-2 block text-sm text-gray-900"
            >
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.id}-${option.value}`}
                  name={field.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={e => onChange(e.target.value)}
                  onBlur={onBlur}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label
                  htmlFor={`${field.id}-${option.value}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
          />
        );
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {field.type !== 'checkbox' && (
        <label
          htmlFor={field.id}
          className="block text-sm font-medium text-gray-700"
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderField()}
      {error && touched && (
        <ValidationMessage message={error} />
      )}
    </div>
  );
};

export default FormField;
