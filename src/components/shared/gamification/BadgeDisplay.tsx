import React, { useState } from 'react';
import Tooltip from '../../../components/ui/Tooltip';
import Badge from '../../../components/ui/Badge';

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate?: Date;
}

interface BadgeDisplayProps {
  badges: BadgeItem[];
  maxDisplay?: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  badges,
  maxDisplay = 3,
  showTooltip = true,
  size = 'md',
  className = ''
}) => {
  const [showAll, setShowAll] = useState(false);

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const rarityColors = {
    common: 'bg-gray-100',
    rare: 'bg-blue-100',
    epic: 'bg-purple-100',
    legendary: 'bg-yellow-100'
  };

  const displayBadges = showAll ? badges : badges.slice(0, maxDisplay);
  const remainingCount = badges.length - maxDisplay;

  const renderBadge = (badge: BadgeItem) => {
    const badgeContent = (
      <div
        className={`
          ${sizes[size]}
          rounded-full
          flex items-center justify-center
          ${badge.rarity ? rarityColors[badge.rarity] : 'bg-gray-100'}
          transition-transform hover:scale-110
        `}
      >
        {badge.icon}
      </div>
    );

    if (showTooltip && (badge.name || badge.description)) {
      return (
        <Tooltip
          content={
            <div className="text-center">
              <div className="font-medium">{badge.name}</div>
              {badge.description && (
                <div className="text-sm text-gray-200">{badge.description}</div>
              )}
              {badge.earnedDate && (
                <div className="text-xs text-gray-300 mt-1">
                  Earned {badge.earnedDate.toLocaleDateString()}
                </div>
              )}
            </div>
          }
        >
          {badgeContent}
        </Tooltip>
      );
    }

    return badgeContent;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {displayBadges.map(badge => (
        <div key={badge.id}>
          {renderBadge(badge)}
        </div>
      ))}
      {!showAll && remainingCount > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className={`
            ${sizes[size]}
            rounded-full bg-gray-100
            flex items-center justify-center
            text-gray-600 hover:bg-gray-200
            transition-colors
          `}
        >
          +{remainingCount}
        </button>
      )}
    </div>
  );
};

export default BadgeDisplay;
