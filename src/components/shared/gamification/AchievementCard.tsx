import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ProgressBar from './ProgressBar';
import Tooltip from '../../../components/ui/Tooltip';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category?: string;
  points?: number;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  rewards?: Array<{
    type: 'points' | 'badge' | 'item' | 'access';
    value: string | number;
    icon?: string;
  }>;
  earnedDate?: Date;
  expiryDate?: Date;
}

interface AchievementCardProps {
  achievement: Achievement;
  isEarned?: boolean;
  isLocked?: boolean;
  showProgress?: boolean;
  showRewards?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isEarned = false,
  isLocked = false,
  showProgress = true,
  showRewards = true,
  size = 'md',
  onClick,
  className = ''
}) => {
  const rarityColors = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800'
  };

  const sizes = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const renderRewards = () => (
    <div className="flex flex-wrap gap-2 mt-2">
      {achievement.rewards?.map((reward, index) => (
        <Tooltip
          key={index}
          content={
            <div className="text-center">
              <div className="font-medium">
                {reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}
              </div>
              <div className="text-sm">
                {typeof reward.value === 'number'
                  ? `${reward.value} ${reward.type === 'points' ? 'pts' : ''}`
                  : reward.value}
              </div>
            </div>
          }
        >
          <div
            className={`
              flex items-center gap-1 px-2 py-1 rounded-full
              bg-gray-100 text-gray-800 text-sm
            `}
          >
            {reward.icon && <span>{reward.icon}</span>}
            <span>
              {typeof reward.value === 'number'
                ? `${reward.value}`
                : reward.type}
            </span>
          </div>
        </Tooltip>
      ))}
    </div>
  );

  return (
    <Card
      className={`
        ${sizes[size]}
        ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
        ${isLocked ? 'opacity-75 grayscale' : ''}
        ${className}
      `}
      onClick={!isLocked ? onClick : undefined}
    >
      <div className="flex gap-4">
        {/* Icon */}
        <div
          className={`
            ${iconSizes[size]}
            ${rarityColors[achievement.rarity]}
            rounded-lg flex items-center justify-center
            ${isLocked ? 'bg-gray-200' : ''}
          `}
        >
          {isLocked ? '🔒' : achievement.icon}
        </div>

        {/* Content */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium ${size === 'lg' ? 'text-lg' : ''}`}>
                {achievement.title}
              </h3>
              {achievement.category && (
                <div className="text-sm text-gray-500">
                  {achievement.category}
                </div>
              )}
            </div>
            <Badge variant={isEarned ? 'success' : 'secondary'}>
              {isEarned ? 'Earned' : 'In Progress'}
            </Badge>
          </div>

          <p className={`text-gray-600 mt-1 ${size === 'sm' ? 'text-sm' : ''}`}>
            {achievement.description}
          </p>

          {/* Progress */}
          {showProgress && achievement.progress && !isLocked && (
            <div className="mt-3">
              <ProgressBar
                current={achievement.progress.current}
                total={achievement.progress.total}
                size="sm"
                color={isEarned ? 'success' : 'primary'}
                showValues
                label={achievement.progress.label}
              />
            </div>
          )}

          {/* Rewards */}
          {showRewards && achievement.rewards && !isLocked && (
            renderRewards()
          )}

          {/* Dates */}
          {(achievement.earnedDate || achievement.expiryDate) && (
            <div className="mt-2 text-sm text-gray-500">
              {achievement.earnedDate && (
                <div>
                  Earned: {achievement.earnedDate.toLocaleDateString()}
                </div>
              )}
              {achievement.expiryDate && (
                <div>
                  Expires: {achievement.expiryDate.toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AchievementCard;
