import React from 'react';
import Card from '../../../../components/ui/Card';
import Chart from '../../../../components/shared/data/Chart';
import Progress from '../../../../components/ui/Progress';
import Badge from '../../../../components/ui/Badge';
import DataGrid from '../../../../components/shared/data/DataGrid';

interface TeacherMetrics {
  id: string;
  name: string;
  department: string;
  courses: number;
  students: number;
  rating: number;
  attendance: number;
  submissionRate: number;
  feedback: {
    positive: number;
    neutral: number;
    negative: number;
  };
  performanceScore: number;
  performanceTrend: 'up' | 'down' | 'stable';
}

interface TeacherPerformanceProps {
  teachers: TeacherMetrics[];
  departmentAverages: Array<{
    department: string;
    averageScore: number;
    teacherCount: number;
  }>;
  overallMetrics: {
    averageRating: number;
    averageAttendance: number;
    averageSubmissionRate: number;
    topPerformers: number;
    needsImprovement: number;
  };
}

const TeacherPerformance: React.FC<TeacherPerformanceProps> = ({
  teachers,
  departmentAverages,
  overallMetrics
}) => {
  const columns = [
    { field: 'name', header: 'Teacher', sortable: true },
    { field: 'department', header: 'Department', sortable: true },
    { field: 'metrics', header: 'Key Metrics', sortable: true },
    { field: 'rating', header: 'Rating', sortable: true },
    { field: 'feedback', header: 'Feedback', sortable: true },
    { field: 'performance', header: 'Performance', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Teacher Performance Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {overallMetrics.averageRating.toFixed(1)}
            <span className="text-sm text-gray-500 ml-2">/5.0</span>
          </div>
          <div className="mt-2 flex">
            {'★'.repeat(Math.round(overallMetrics.averageRating))}
            {'☆'.repeat(5 - Math.round(overallMetrics.averageRating))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Attendance Rate</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {overallMetrics.averageAttendance}%
          </div>
          <Progress
            value={overallMetrics.averageAttendance}
            max={100}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Submission Rate</h3>
          <div className="text-3xl font-bold text-indigo-600">
            {overallMetrics.averageSubmissionRate}%
          </div>
          <Progress
            value={overallMetrics.averageSubmissionRate}
            max={100}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Performance Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Top Performers</span>
              <Badge variant="success">{overallMetrics.topPerformers}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Needs Improvement</span>
              <Badge variant="warning">{overallMetrics.needsImprovement}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Department Performance */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Department Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64">
            <Chart
              type="bar"
              data={{
                labels: departmentAverages.map(d => d.department),
                datasets: [{
                  data: departmentAverages.map(d => d.averageScore)
                }]
              }}
            />
          </div>
          <div className="space-y-4">
            {departmentAverages.map(dept => (
              <div key={dept.department} className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{dept.department}</h4>
                  <span className="text-sm text-gray-500">
                    {dept.teacherCount} teachers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={dept.averageScore} max={100} />
                  <span>{dept.averageScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Individual Performance Table */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Individual Performance</h3>
        <DataGrid
          columns={columns}
          data={teachers.map(teacher => ({
            ...teacher,
            metrics: (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Courses:</span>
                  <span>{teacher.courses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Students:</span>
                  <span>{teacher.students}</span>
                </div>
              </div>
            ),
            rating: (
              <div className="flex items-center gap-1">
                <span>{teacher.rating.toFixed(1)}</span>
                <div className="text-yellow-400">
                  {'★'.repeat(Math.round(teacher.rating))}
                  {'☆'.repeat(5 - Math.round(teacher.rating))}
                </div>
              </div>
            ),
            feedback: (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <Badge variant="success">{teacher.feedback.positive}%</Badge>
                  <Badge variant="warning">{teacher.feedback.neutral}%</Badge>
                  <Badge variant="danger">{teacher.feedback.negative}%</Badge>
                </div>
              </div>
            ),
            performance: (
              <div className="flex items-center gap-2">
                <Progress value={teacher.performanceScore} max={100} />
                <Badge variant={
                  teacher.performanceTrend === 'up' ? 'success' :
                  teacher.performanceTrend === 'down' ? 'danger' :
                  'secondary'
                }>
                  {teacher.performanceTrend === 'up' ? '↑' :
                   teacher.performanceTrend === 'down' ? '↓' : '→'}
                </Badge>
              </div>
            )
          }))}
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default TeacherPerformance;
