import { type FC, type SelectHTMLAttributes } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
}

const Select: FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  fullWidth = false,
  size = 'md',
  className = '',
  id,
  placeholder,
  ...props
}) => {
  const baseStyles = 'block rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500';
  const width = fullWidth ? 'w-full' : '';
  const errorStyles = error
    ? 'border-red-300 text-red-900'
    : 'border-gray-300';
  
  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg',
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`${baseStyles} ${width} ${errorStyles} ${sizes[size]} ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p
          className={`mt-1 text-sm ${
            error ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
