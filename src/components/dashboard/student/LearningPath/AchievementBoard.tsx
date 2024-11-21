import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Badge from '../../../ui/Badge';
import Progress from '../../../ui/Progress';
import Tabs from '../../../ui/Tabs';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'academic' | 'participation' | 'skill' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  dateEarned?: string;
  points: number;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  rewards: {
    points: number;
    badges?: string[];
  };
  status: 'completed' | 'in-progress' | 'locked';
}

const AchievementBoard: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample achievements data - in a real app, this would come from an API
  const achievements: Achievement[] = [
    {
      id: 'ach1',
      name: 'Quick Learner',
      description: 'Complete 5 lessons in a single day',
      icon: '🚀',
      category: 'academic',
      rarity: 'common',
      progress: 5,
      maxProgress: 5,
      dateEarned: '2024-03-15',
      points: 100,
    },
    {
      id: 'ach2',
      name: 'Discussion Master',
      description: 'Participate in 20 forum discussions',
      icon: '💬',
      category: 'participation',
      rarity: 'rare',
      progress: 15,
      maxProgress: 20,
      points: 250,
    },
    {
      id: 'ach3',
      name: 'Perfect Score',
      description: 'Get 100% on any assessment',
      icon: '🏆',
      category: 'academic',
      rarity: 'epic',
      progress: 1,
      maxProgress: 1,
      dateEarned: '2024-03-10',
      points: 500,
    },
  ];

  // Sample milestones data
  const milestones: Milestone[] = [
    {
      id: 'mil1',
      name: 'First Steps',
      description: 'Complete your first course module',
      progress: 1,
      maxProgress: 1,
      rewards: {
        points: 100,
        badges: ['Beginner Explorer'],
      },
      status: 'completed',
    },
    {
      id: 'mil2',
      name: 'Knowledge Seeker',
      description: 'Complete 5 different course modules',
      progress: 3,
      maxProgress: 5,
      rewards: {
        points: 250,
        badges: ['Module Master'],
      },
      status: 'in-progress',
    },
    {
      id: 'mil3',
      name: 'Academic Excellence',
      description: 'Maintain an average grade of 90% or higher',
      progress: 85,
      maxProgress: 90,
      rewards: {
        points: 500,
        badges: ['Honor Student'],
      },
      status: 'in-progress',
    },
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-purple-500';
      case 'epic':
        return 'bg-gradient-to-r from-purple-400 to-pink-500';
      case 'rare':
        return 'bg-gradient-to-r from-blue-400 to-indigo-500';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'locked':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const filteredAchievements = achievements.filter(
    (achievement) => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const calculateLevel = () => {
    const totalPoints = achievements
      .filter((a) => a.dateEarned)
      .reduce((sum, a) => sum + a.points, 0);
    return Math.floor(totalPoints / 1000) + 1;
  };

  const tabs = [
    {
      id: 'achievements',
      label: 'Achievements',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-sm text-gray-500">Current Level</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {calculateLevel()}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-sm text-gray-500">Total Achievements</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {achievements.filter((a) => a.dateEarned).length}/{achievements.length}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-sm text-gray-500">Points Earned</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {achievements
                    .filter((a) => a.dateEarned)
                    .reduce((sum, a) => sum + a.points, 0)}
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                      ${getRarityColor(achievement.rarity)} text-white
                    `}>
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.name}</h3>
                      <p className="text-sm text-gray-500">{achievement.description}</p>
                    </div>
                  </div>

                  <Progress
                    value={achievement.progress}
                    max={achievement.maxProgress}
                    variant={achievement.dateEarned ? 'success' : 'primary'}
                    size="sm"
                    showValue
                  />

                  <div className="flex justify-between items-center text-sm">
                    <Badge variant={achievement.dateEarned ? 'success' : 'secondary'}>
                      {achievement.dateEarned ? 'Earned' : 'In Progress'}
                    </Badge>
                    <span className="font-medium text-indigo-600">
                      {achievement.points} points
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'milestones',
      label: 'Milestones',
      content: (
        <div className="space-y-6">
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{milestone.name}</h3>
                    <p className="text-sm text-gray-500">{milestone.description}</p>
                  </div>
                  <Badge variant={getStatusColor(milestone.status)}>
                    {milestone.status}
                  </Badge>
                </div>

                <Progress
                  value={milestone.progress}
                  max={milestone.maxProgress}
                  variant={getStatusColor(milestone.status)}
                  size="md"
                  showValue
                />

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Rewards</h4>
                  <div className="flex items-center space-x-4">
                    <span className="text-indigo-600 font-medium">
                      {milestone.rewards.points} points
                    </span>
                    {milestone.rewards.badges && (
                      <div className="flex gap-2">
                        {milestone.rewards.badges.map((badge) => (
                          <Badge key={badge} variant="primary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} />
    </div>
  );
};

export default AchievementBoard;
