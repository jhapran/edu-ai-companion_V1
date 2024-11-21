import React from 'react';
import Card from '../../../../components/ui/Card';
import Chart from '../../../../components/shared/data/Chart';
import Progress from '../../../../components/ui/Progress';
import Badge from '../../../../components/ui/Badge';
import DataGrid from '../../../../components/shared/data/DataGrid';

interface EngagementData {
  overall: {
    activeUsers: number;
    totalUsers: number;
    averageTimeSpent: number;
    participationRate: number;
  };
  byActivity: Array<{
    type: string;
    engagementRate: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  byDepartment: Array<{
    department: string;
    engagementRate: number;
    activeStudents: number;
    totalStudents: number;
  }>;
  timeline: Array<{
    date: Date;
    activeUsers: number;
    activities: number;
  }>;
}

interface StudentEngagementMetricsProps {
  data: EngagementData;
}

const StudentEngagementMetrics: React.FC<StudentEngagementMetricsProps> = ({
  data
}) => {
  const activityColumns = [
    { field: 'type', header: 'Activity Type', sortable: true },
    { field: 'engagementRate', header: 'Engagement Rate', sortable: true },
    { field: 'trend', header: 'Trend', sortable: true }
  ];

  const departmentColumns = [
    { field: 'department', header: 'Department', sortable: true },
    { field: 'engagementRate', header: 'Engagement', sortable: true },
    { field: 'activeStudents', header: 'Active/Total', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Student Engagement Metrics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Active Users</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {data.overall.activeUsers}
            <span className="text-sm text-gray-500 ml-2">
              /{data.overall.totalUsers}
            </span>
          </div>
          <Progress
            value={data.overall.activeUsers}
            max={data.overall.totalUsers}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Avg. Time Spent</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {data.overall.averageTimeSpent}
            <span className="text-sm text-gray-500 ml-2">min/day</span>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Participation Rate</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {data.overall.participationRate}%
          </div>
          <Progress
            value={data.overall.participationRate}
            max={100}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Activity Trend</h3>
          <Chart
            type="line"
            data={{
              labels: data.timeline.map(t => t.date.toLocaleDateString()),
              datasets: [{
                data: data.timeline.map(t => t.activeUsers)
              }]
            }}
          />
        </Card>
      </div>

      {/* Activity Engagement */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement by Activity</h3>
        <DataGrid
          columns={activityColumns}
          data={data.byActivity.map(activity => ({
            ...activity,
            engagementRate: (
              <div className="flex items-center gap-2">
                <Progress value={activity.engagementRate} max={100} />
                <span>{activity.engagementRate}%</span>
              </div>
            ),
            trend: (
              <Badge variant={
                activity.trend === 'up' ? 'success' :
                activity.trend === 'down' ? 'danger' :
                'secondary'
              }>
                {activity.trend === 'up' ? '↑' :
                 activity.trend === 'down' ? '↓' : '→'}
              </Badge>
            )
          }))}
          pageSize={5}
        />
      </Card>

      {/* Department Engagement */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement by Department</h3>
        <DataGrid
          columns={departmentColumns}
          data={data.byDepartment.map(dept => ({
            ...dept,
            engagementRate: (
              <div className="flex items-center gap-2">
                <Progress value={dept.engagementRate} max={100} />
                <span>{dept.engagementRate}%</span>
              </div>
            ),
            activeStudents: (
              <div className="flex items-center gap-2">
                <span>{dept.activeStudents}/{dept.totalStudents}</span>
                <Badge variant={
                  (dept.activeStudents / dept.totalStudents) >= 0.8 ? 'success' :
                  (dept.activeStudents / dept.totalStudents) >= 0.6 ? 'warning' :
                  'danger'
                }>
                  {Math.round((dept.activeStudents / dept.totalStudents) * 100)}%
                </Badge>
              </div>
            )
          }))}
          pageSize={5}
        />
      </Card>

      {/* Engagement Timeline */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Engagement Timeline</h3>
        <div className="h-64">
          <Chart
            type="bar"
            data={{
              labels: data.timeline.map(t => t.date.toLocaleDateString()),
              datasets: [
                {
                  label: 'Active Users',
                  data: data.timeline.map(t => t.activeUsers)
                },
                {
                  label: 'Activities',
                  data: data.timeline.map(t => t.activities)
                }
              ]
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default StudentEngagementMetrics;
