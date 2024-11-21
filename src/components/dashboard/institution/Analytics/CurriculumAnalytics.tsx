import React from 'react';
import Card from '../../../../components/ui/Card';
import Chart from '../../../../components/shared/data/Chart';
import DataGrid from '../../../../components/shared/data/DataGrid';
import Badge from '../../../../components/ui/Badge';
import Progress from '../../../../components/ui/Progress';

interface CourseAnalytics {
  id: string;
  code: string;
  name: string;
  department: string;
  enrollmentRate: number;
  completionRate: number;
  averageGrade: number;
  studentSatisfaction: number;
  learningOutcomes: Array<{
    id: string;
    description: string;
    achievementRate: number;
  }>;
}

interface CurriculumAnalyticsProps {
  courses: CourseAnalytics[];
  departmentPerformance: Array<{
    department: string;
    performance: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  learningOutcomesOverview: {
    achieved: number;
    inProgress: number;
    needsImprovement: number;
  };
}

const CurriculumAnalytics: React.FC<CurriculumAnalyticsProps> = ({
  courses,
  departmentPerformance,
  learningOutcomesOverview
}) => {
  const columns = [
    { field: 'code', header: 'Code', sortable: true },
    { field: 'name', header: 'Course Name', sortable: true },
    { field: 'department', header: 'Department', sortable: true },
    { field: 'enrollmentRate', header: 'Enrollment', sortable: true },
    { field: 'completionRate', header: 'Completion', sortable: true },
    { field: 'averageGrade', header: 'Avg. Grade', sortable: true },
    { field: 'satisfaction', header: 'Satisfaction', sortable: true }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Curriculum Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Learning Outcomes</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Achieved</span>
              <Badge variant="success">{learningOutcomesOverview.achieved}%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>In Progress</span>
              <Badge variant="warning">{learningOutcomesOverview.inProgress}%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Needs Improvement</span>
              <Badge variant="danger">{learningOutcomesOverview.needsImprovement}%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Department Performance</h3>
          <div className="space-y-2">
            {departmentPerformance.map(dept => (
              <div key={dept.department} className="flex justify-between items-center">
                <span>{dept.department}</span>
                <div className="flex items-center gap-2">
                  <Progress value={dept.performance} max={100} />
                  <span className={
                    dept.trend === 'up' ? 'text-green-500' :
                    dept.trend === 'down' ? 'text-red-500' :
                    'text-gray-500'
                  }>
                    {dept.trend === 'up' ? '↑' : dept.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Overall Statistics</h3>
          <Chart
            type="pie"
            data={{
              labels: ['Achieved', 'In Progress', 'Needs Improvement'],
              datasets: [{
                data: [
                  learningOutcomesOverview.achieved,
                  learningOutcomesOverview.inProgress,
                  learningOutcomesOverview.needsImprovement
                ]
              }]
            }}
          />
        </Card>
      </div>

      {/* Course Performance Table */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Course Performance</h3>
        <DataGrid
          columns={columns}
          data={courses.map(course => ({
            ...course,
            enrollmentRate: (
              <div className="w-32">
                <Progress value={course.enrollmentRate} max={100} />
                <span className="text-sm">{course.enrollmentRate}%</span>
              </div>
            ),
            completionRate: (
              <div className="w-32">
                <Progress value={course.completionRate} max={100} />
                <span className="text-sm">{course.completionRate}%</span>
              </div>
            ),
            averageGrade: (
              <Badge variant={
                course.averageGrade >= 80 ? 'success' :
                course.averageGrade >= 60 ? 'warning' :
                'danger'
              }>
                {course.averageGrade}%
              </Badge>
            ),
            satisfaction: (
              <div className="flex items-center gap-1">
                {'★'.repeat(Math.round(course.studentSatisfaction))}
                {'☆'.repeat(5 - Math.round(course.studentSatisfaction))}
              </div>
            )
          }))}
          pageSize={10}
        />
      </Card>

      {/* Learning Outcomes Details */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Learning Outcomes Analysis</h3>
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="border-b pb-4 last:border-b-0">
              <h4 className="font-medium mb-2">{course.code} - {course.name}</h4>
              <div className="space-y-2">
                {course.learningOutcomes.map(outcome => (
                  <div key={outcome.id} className="flex items-center gap-4">
                    <div className="flex-grow">
                      <p className="text-sm">{outcome.description}</p>
                    </div>
                    <div className="w-32 flex items-center gap-2">
                      <Progress value={outcome.achievementRate} max={100} />
                      <span className="text-sm">{outcome.achievementRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CurriculumAnalytics;
