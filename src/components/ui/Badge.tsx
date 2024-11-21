import { type FC, type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  dot?: boolean;
  className?: string;
}

const Badge: FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  dot = false,
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center font-medium';
  
  const variants = {
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const roundedStyles = rounded ? 'rounded-full' : 'rounded';

  const dotColors = {
    primary: 'bg-indigo-400',
    secondary: 'bg-gray-400',
    success: 'bg-green-400',
    danger: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedStyles}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            mr-1.5 h-2 w-2 rounded-full ${dotColors[variant]}
          `}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
