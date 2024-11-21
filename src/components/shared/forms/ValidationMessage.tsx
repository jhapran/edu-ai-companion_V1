import React from 'react';

interface ValidationMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'success';
  className?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  className = ''
}) => {
  const colors = {
    error: 'text-red-600',
    warning: 'text-yellow-600',
    success: 'text-green-600'
  };

  return (
    <p className={`text-sm mt-1 ${colors[type]} ${className}`}>
      {message}
    </p>
  );
};

export default ValidationMessage;
