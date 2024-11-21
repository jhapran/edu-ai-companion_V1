import { type FC, useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
}

const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  initials,
  size = 'md',
  shape = 'circle',
  status,
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: {
      wrapper: 'h-6 w-6',
      text: 'text-xs',
      status: 'h-1.5 w-1.5',
    },
    sm: {
      wrapper: 'h-8 w-8',
      text: 'text-sm',
      status: 'h-2 w-2',
    },
    md: {
      wrapper: 'h-10 w-10',
      text: 'text-base',
      status: 'h-2.5 w-2.5',
    },
    lg: {
      wrapper: 'h-12 w-12',
      text: 'text-lg',
      status: 'h-3 w-3',
    },
    xl: {
      wrapper: 'h-16 w-16',
      text: 'text-xl',
      status: 'h-3.5 w-3.5',
    },
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400',
    busy: 'bg-red-400',
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={handleImageError}
          className={`object-cover w-full h-full ${shapes[shape]}`}
        />
      );
    }

    if (initials) {
      return (
        <div
          className={`
            flex items-center justify-center w-full h-full
            bg-gray-200 text-gray-600 font-medium
            ${shapes[shape]} ${sizes[size].text}
          `}
        >
          {initials.toUpperCase()}
        </div>
      );
    }

    return (
      <div
        className={`
          flex items-center justify-center w-full h-full
          bg-gray-200 text-gray-400
          ${shapes[shape]}
        `}
      >
        <svg
          className="w-1/2 h-1/2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  };

  return (
    <div
      className={`
        relative inline-block
        ${sizes[size].wrapper}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {renderContent()}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            block rounded-full ring-2 ring-white
            ${sizes[size].status}
            ${statusColors[status]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
