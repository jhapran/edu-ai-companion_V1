import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Select from '../../../ui/Select';
import Progress from '../../../ui/Progress';
import Badge from '../../../ui/Badge';
import Tabs from '../../../ui/Tabs';

interface EngagementStatsProps {
  courseId?: string;
  timeRange?: 'week' | 'month' | 'semester' | 'year';
}

interface EngagementMetric {
  label: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

const EngagementStats: FC<EngagementStatsProps> = ({
  courseId,
  timeRange = 'month',
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
    { value: 'year', label: 'This Year' },
  ];

  // Sample engagement metrics - in a real app, this would come from an API
  const metrics: EngagementMetric[] = [
    {
      label: 'Average Time Spent',
      value: 45,
      previousValue: 40,
      unit: 'minutes/day',
      trend: 'up',
    },
    {
      label: 'Discussion Participation',
      value: 78,
      previousValue: 82,
      unit: '%',
      trend: 'down',
    },
    {
      label: 'Resource Access Rate',
      value: 92,
      previousValue: 88,
      unit: '%',
      trend: 'up',
    },
    {
      label: 'Assignment Submission Rate',
      value: 95,
      previousValue: 95,
      unit: '%',
      trend: 'stable',
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  // Sample engagement data for different views
  const engagementTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-500">
                    {metric.label}
                  </h3>
                  <span className={`flex items-center ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                    <span className="ml-1 text-xs">
                      {Math.abs(metric.value - metric.previousValue)}%
                    </span>
                  </span>
                </div>
                <p className="text-2xl font-semibold">
                  {metric.value}{metric.unit.includes('%') ? '%' : ''}
                </p>
                <Progress
                  value={metric.value}
                  max={100}
                  variant={metric.trend === 'down' ? 'warning' : 'primary'}
                  size="sm"
                />
                <p className="text-xs text-gray-500">
                  Previous: {metric.previousValue}{metric.unit.includes('%') ? '%' : ''} {metric.unit}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'participation',
      label: 'Participation Details',
      content: (
        <div className="space-y-6">
          <Card title="Discussion Activity">
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Active Participants</span>
                <span>85%</span>
              </div>
              <Progress value={85} max={100} variant="primary" size="sm" />
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-indigo-600">156</div>
                  <div className="text-sm text-gray-500">Total Posts</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-indigo-600">4.2</div>
                  <div className="text-sm text-gray-500">Avg Posts/Student</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-semibold text-indigo-600">89%</div>
                  <div className="text-sm text-gray-500">Response Rate</div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Resource Engagement">
            <div className="space-y-4">
              {[
                { name: 'Course Materials', access: 95 },
                { name: 'Supplementary Resources', access: 68 },
                { name: 'Video Lectures', access: 82 },
                { name: 'Practice Exercises', access: 75 },
              ].map((resource) => (
                <div key={resource.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{resource.name}</span>
                    <span>{resource.access}% accessed</span>
                  </div>
                  <Progress value={resource.access} max={100} variant="success" size="sm" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'trends',
      label: 'Engagement Trends',
      content: (
        <div className="space-y-6">
          <Card title="Weekly Engagement Pattern">
            <div className="space-y-4">
              {[
                { day: 'Monday', value: 85 },
                { day: 'Tuesday', value: 92 },
                { day: 'Wednesday', value: 78 },
                { day: 'Thursday', value: 88 },
                { day: 'Friday', value: 72 },
                { day: 'Saturday', value: 45 },
                { day: 'Sunday', value: 38 },
              ].map((day) => (
                <div key={day.day} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{day.day}</span>
                    <span className="font-medium">{day.value}%</span>
                  </div>
                  <Progress value={day.value} max={100} variant="primary" size="sm" />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Peak Activity Times">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { time: 'Morning', percentage: 35, label: '8 AM - 12 PM' },
                { time: 'Afternoon', percentage: 45, label: '12 PM - 4 PM' },
                { time: 'Evening', percentage: 15, label: '4 PM - 8 PM' },
                { time: 'Night', percentage: 5, label: '8 PM - 12 AM' },
              ].map((timeSlot) => (
                <div key={timeSlot.time} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-indigo-600">
                    {timeSlot.percentage}%
                  </div>
                  <div className="text-sm font-medium">{timeSlot.time}</div>
                  <div className="text-xs text-gray-500">{timeSlot.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="w-48">
          <Select
            options={timeRangeOptions}
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as typeof timeRange)}
          />
        </div>
      </div>

      <Tabs tabs={engagementTabs} />
    </div>
  );
};

export default EngagementStats;
