import { type FC, type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  headerAction?: ReactNode;
  className?: string;
  noPadding?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  headerAction,
  className = '',
  noPadding = false,
  bordered = true,
  hoverable = false,
  onClick,
}) => {
  const baseStyles = 'bg-white rounded-lg overflow-hidden';
  const borderStyles = bordered ? 'border border-gray-200' : '';
  const hoverStyles = hoverable ? 'transition-shadow hover:shadow-lg' : 'shadow-sm';
  const contentPadding = noPadding ? '' : 'p-4 sm:p-6';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseStyles} ${borderStyles} ${hoverStyles} ${className} ${clickableStyles}`}
      onClick={onClick}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction) && (
        <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
            {headerAction && (
              <div className="flex-shrink-0">
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className={contentPadding}>
        {children}
      </div>

      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
