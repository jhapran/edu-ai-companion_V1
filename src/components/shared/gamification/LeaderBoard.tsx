import React from 'react';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Progress from '../../../components/ui/Progress';
import BadgeDisplay from './BadgeDisplay';

interface LeaderboardEntry {
  id: string;
  rank: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    level?: number;
  };
  score: number;
  badges?: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  trend?: 'up' | 'down' | 'stable';
  stats?: Record<string, number>;
}

interface LeaderBoardProps {
  entries: LeaderboardEntry[];
  title?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  category?: string;
  showBadges?: boolean;
  showProgress?: boolean;
  showStats?: boolean;
  highlightUserId?: string;
  maxEntries?: number;
  className?: string;
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({
  entries,
  title = 'Leaderboard',
  period = 'all-time',
  category,
  showBadges = true,
  showProgress = true,
  showStats = true,
  highlightUserId,
  maxEntries = 10,
  className = ''
}) => {
  const displayEntries = entries.slice(0, maxEntries);

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-green-500">↑</span>;
      case 'down':
        return <span className="text-red-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-gray-100 text-gray-800';
      case 3:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="text-sm text-gray-500">
            {category && <span>{category} • </span>}
            {period.replace('-', ' ')}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {displayEntries.map((entry) => (
          <div
            key={entry.id}
            className={`
              flex items-center gap-4 p-4 rounded-lg
              ${highlightUserId === entry.user.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}
              transition-colors
            `}
          >
            {/* Rank */}
            <div
              className={`
                w-8 h-8 flex items-center justify-center rounded-full font-bold
                ${getRankStyle(entry.rank)}
              `}
            >
              {entry.rank}
            </div>

            {/* User Info */}
            <div className="flex-grow flex items-center gap-3">
              <Avatar
                src={entry.user.avatar}
                alt={entry.user.name}
                size="md"
              />
              <div>
                <div className="font-medium flex items-center gap-2">
                  {entry.user.name}
                  {entry.trend && getTrendIcon(entry.trend)}
                </div>
                {entry.user.role && (
                  <div className="text-sm text-gray-500">{entry.user.role}</div>
                )}
              </div>
            </div>

            {/* Badges */}
            {showBadges && entry.badges && entry.badges.length > 0 && (
              <div className="flex gap-1">
                <BadgeDisplay badges={entry.badges} maxDisplay={3} />
              </div>
            )}

            {/* Progress */}
            {showProgress && entry.progress && (
              <div className="w-32">
                <Progress
                  value={entry.progress.current}
                  max={entry.progress.total}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {entry.progress.label}
                </div>
              </div>
            )}

            {/* Stats */}
            {showStats && entry.stats && (
              <div className="flex gap-4">
                {Object.entries(entry.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-sm font-medium">{value}</div>
                    <div className="text-xs text-gray-500">{key}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Score */}
            <div className="text-lg font-bold text-indigo-600 min-w-[60px] text-right">
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {entries.length > maxEntries && (
        <div className="mt-4 text-center">
          <Button variant="ghost" className="text-indigo-600">
            View All Rankings
          </Button>
        </div>
      )}
    </Card>
  );
};

export default LeaderBoard;
