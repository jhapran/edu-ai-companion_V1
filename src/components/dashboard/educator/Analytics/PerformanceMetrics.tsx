import { type FC } from 'react';
import Card from '../../../ui/Card';
import Progress from '../../../ui/Progress';
import Select from '../../../ui/Select';
import { useState } from 'react';

interface Metric {
  label: string;
  value: number;
  change: number;
  unit?: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

interface PerformanceMetricsProps {
  courseId?: string;
  timeRange?: 'week' | 'month' | 'semester' | 'year';
}

const PerformanceMetrics: FC<PerformanceMetricsProps> = ({
  courseId,
  timeRange = 'month',
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Sample metrics data - in a real app, this would come from an API
  const metrics: Metric[] = [
    {
      label: 'Average Score',
      value: 85,
      change: 5,
      unit: '%',
      color: 'primary',
    },
    {
      label: 'Completion Rate',
      value: 92,
      change: -2,
      unit: '%',
      color: 'success',
    },
    {
      label: 'Engagement Rate',
      value: 78,
      change: 12,
      unit: '%',
      color: 'warning',
    },
    {
      label: 'At-Risk Students',
      value: 8,
      change: -3,
      color: 'danger',
    },
  ];

  const timeRangeOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
    { value: 'year', label: 'This Year' },
  ];

  // Sample performance data for the chart
  const performanceData = {
    assignments: [
      { name: 'Assignment 1', avgScore: 88 },
      { name: 'Assignment 2', avgScore: 82 },
      { name: 'Assignment 3', avgScore: 90 },
      { name: 'Assignment 4', avgScore: 85 },
    ],
    quizzes: [
      { name: 'Quiz 1', avgScore: 85 },
      { name: 'Quiz 2', avgScore: 78 },
      { name: 'Quiz 3', avgScore: 92 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <div className="w-48">
          <Select
            options={timeRangeOptions}
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as typeof timeRange)}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-gray-500">
                  {metric.label}
                </h3>
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                  ${metric.change > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
              </div>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {metric.value}{metric.unit}
                </p>
              </div>
              <Progress
                value={metric.value}
                max={100}
                variant={metric.color}
                size="sm"
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Assignment Performance */}
      <Card title="Assignment Performance">
        <div className="space-y-4">
          {performanceData.assignments.map((assignment) => (
            <div key={assignment.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  {assignment.name}
                </span>
                <span className="text-sm text-gray-900">
                  {assignment.avgScore}%
                </span>
              </div>
              <Progress
                value={assignment.avgScore}
                max={100}
                variant="primary"
                size="sm"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Quiz Performance */}
      <Card title="Quiz Performance">
        <div className="space-y-4">
          {performanceData.quizzes.map((quiz) => (
            <div key={quiz.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  {quiz.name}
                </span>
                <span className="text-sm text-gray-900">
                  {quiz.avgScore}%
                </span>
              </div>
              <Progress
                value={quiz.avgScore}
                max={100}
                variant="success"
                size="sm"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Areas for Improvement">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2" />
              Increased number of late submissions
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2" />
              Lower participation in group discussions
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2" />
              Quiz scores declining in specific topics
            </li>
          </ul>
        </Card>

        <Card title="Recommendations">
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              Schedule additional review sessions
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              Implement peer tutoring program
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              Create targeted study materials
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
