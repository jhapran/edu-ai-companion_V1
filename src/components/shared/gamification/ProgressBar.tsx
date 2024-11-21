import React from 'react';
import Progress from '../../../components/ui/Progress';
import Tooltip from '../../../components/ui/Tooltip';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  animated?: boolean;
  milestones?: Array<{
    value: number;
    label: string;
    icon?: string;
    reward?: string;
  }>;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  sublabel,
  showPercentage = true,
  showValues = true,
  size = 'md',
  color = 'primary',
  animated = true,
  milestones = [],
  className = ''
}) => {
  const percentage = Math.round((current / total) * 100);

  const renderMilestones = () => {
    return milestones.map((milestone, index) => {
      const milestonePercentage = (milestone.value / total) * 100;
      const isAchieved = current >= milestone.value;

      return (
        <Tooltip
          key={index}
          content={
            <div className="text-center">
              <div className="font-medium">{milestone.label}</div>
              {milestone.reward && (
                <div className="text-sm text-gray-200">
                  Reward: {milestone.reward}
                </div>
              )}
            </div>
          }
        >
          <div
            className={`
              absolute w-4 h-4 -translate-x-2 -translate-y-1
              rounded-full border-2 border-white
              ${isAchieved ? `bg-${color}-600` : 'bg-gray-300'}
              cursor-pointer transition-colors
            `}
            style={{ left: `${milestonePercentage}%` }}
          >
            {milestone.icon && (
              <span className="absolute -top-6 left-1/2 -translate-x-1/2">
                {milestone.icon}
              </span>
            )}
          </div>
        </Tooltip>
      );
    });
  };

  return (
    <div className={className}>
      {/* Labels */}
      {(label || showValues || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          <div>
            {label && (
              <div className="font-medium text-sm">
                {label}
              </div>
            )}
            {sublabel && (
              <div className="text-xs text-gray-500">
                {sublabel}
              </div>
            )}
          </div>
          <div className="text-sm">
            {showValues && (
              <span className="text-gray-600">
                {current.toLocaleString()} / {total.toLocaleString()}
              </span>
            )}
            {showPercentage && showValues && <span className="mx-1">•</span>}
            {showPercentage && (
              <span className="font-medium text-gray-900">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative">
        <Progress
          value={current}
          max={total}
          size={size}
          variant={color}
          animated={animated}
          className={`rounded-full overflow-hidden`}
        />
        {milestones.length > 0 && renderMilestones()}
      </div>
    </div>
  );
};

export default ProgressBar;
