import React from 'react';

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 5,
  size = 'md',
  readonly = false,
  onChange,
  className = ''
}) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleClick = (newValue: number) => {
    if (!readonly && onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, newValue: number) => {
    if (!readonly && onChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(newValue);
    }
  };

  return (
    <div
      className={`flex items-center gap-1 ${sizes[size]} ${className} ${
        !readonly ? 'cursor-pointer' : ''
      }`}
      role="group"
      aria-label={`Rating: ${value} out of ${maxValue} stars`}
    >
      {Array.from({ length: maxValue }, (_, index) => {
        const starValue = index + 1;
        const isFilled = value >= starValue;
        const isHalf = value + 0.5 >= starValue && value < starValue;

        return (
          <span
            key={index}
            onClick={() => handleClick(starValue)}
            onKeyDown={e => handleKeyDown(e, starValue)}
            role={readonly ? 'presentation' : 'button'}
            tabIndex={readonly ? -1 : 0}
            className={`
              ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
              ${!readonly ? 'hover:text-yellow-500' : ''}
              transition-colors
            `}
            aria-label={`${starValue} star${starValue === 1 ? '' : 's'}`}
          >
            {isHalf ? '★' : isFilled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
