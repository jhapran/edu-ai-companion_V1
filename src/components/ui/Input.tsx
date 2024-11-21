import { type FC, type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      startIcon,
      endIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'block rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm';
    const width = fullWidth ? 'w-full' : '';
    const errorStyles = error
      ? 'border-red-300 text-red-900 placeholder-red-300'
      : 'border-gray-300 placeholder-gray-400';
    const iconPadding = startIcon ? 'pl-10' : endIcon ? 'pr-10' : '';

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
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`${baseStyles} ${width} ${errorStyles} ${iconPadding} ${className}`}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
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
  }
);

Input.displayName = 'Input';

export default Input;
