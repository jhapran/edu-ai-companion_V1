import { type FC } from 'react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
  centered?: boolean;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = '',
  label,
  centered = false,
}) => {
  const sizes = {
    xs: 'h-4 w-4',
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const variants = {
    primary: 'text-indigo-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  const wrapper = centered ? 'flex flex-col items-center justify-center' : 'inline-flex flex-col items-center';

  return (
    <div className={wrapper}>
      <svg
        className={`
          animate-spin
          ${sizes[size]}
          ${variants[variant]}
          ${className}
        `}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        data-testid="loading-spinner"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && (
        <span
          className={`
            mt-2 text-sm font-medium
            ${variants[variant]}
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;