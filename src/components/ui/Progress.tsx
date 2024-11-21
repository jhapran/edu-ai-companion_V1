import { type FC } from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  showValue?: boolean;
  valuePosition?: 'inside' | 'outside';
  label?: string;
  className?: string;
  animated?: boolean;
}

const Progress: FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  valuePosition = 'outside',
  label,
  className = '',
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const variants = {
    primary: {
      bar: 'bg-indigo-600',
      text: 'text-indigo-600',
    },
    secondary: {
      bar: 'bg-gray-600',
      text: 'text-gray-600',
    },
    success: {
      bar: 'bg-green-600',
      text: 'text-green-600',
    },
    danger: {
      bar: 'bg-red-600',
      text: 'text-red-600',
    },
    warning: {
      bar: 'bg-yellow-500',
      text: 'text-yellow-600',
    },
  };

  const animation = animated ? 'transition-all duration-500 ease-in-out' : '';

  return (
    <div className={className}>
      {/* Label and value (if outside) */}
      {(label || (showValue && valuePosition === 'outside')) && (
        <div className="flex justify-between mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showValue && valuePosition === 'outside' && (
            <span className={`text-sm font-medium ${variants[variant].text}`}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`
            ${variants[variant].bar}
            ${sizes[size]}
            ${animation}
            rounded-full
            flex items-center justify-center
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {/* Value (if inside) */}
          {showValue && valuePosition === 'inside' && size !== 'sm' && (
            <span className="text-xs font-medium text-white">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
