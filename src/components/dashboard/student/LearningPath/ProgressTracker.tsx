import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Progress from '../../../ui/Progress';
import Badge from '../../../ui/Badge';
import Select from '../../../ui/Select';
import Tabs from '../../../ui/Tabs';

interface Course {
  id: string;
  name: string;
  progress: number;
  modules: Module[];
  startDate: string;
  endDate: string;
  status: 'on-track' | 'behind' | 'ahead';
  grade?: number;
}

interface Module {
  id: string;
  name: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'not-started';
  activities: Activity[];
  dueDate: string;
}

interface Activity {
  id: string;
  name: string;
  type: 'lesson' | 'quiz' | 'assignment' | 'discussion';
  status: 'completed' | 'in-progress' | 'not-started';
  score?: number;
  dueDate: string;
}

const ProgressTracker: FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('semester');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Sample courses data - in a real app, this would come from an API
  const courses: Course[] = [
    {
      id: 'course1',
      name: 'Introduction to Computer Science',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-05-15',
      status: 'on-track',
      grade: 88,
      modules: [
        {
          id: 'module1',
          name: 'Programming Basics',
          progress: 100,
          status: 'completed',
          dueDate: '2024-02-15',
          activities: [
            {
              id: 'activity1',
              name: 'Introduction to Python',
              type: 'lesson',
              status: 'completed',
              score: 95,
              dueDate: '2024-02-01',
            },
            {
              id: 'activity2',
              name: 'Basic Programming Quiz',
              type: 'quiz',
              status: 'completed',
              score: 90,
              dueDate: '2024-02-08',
            },
          ],
        },
        {
          id: 'module2',
          name: 'Data Structures',
          progress: 50,
          status: 'in-progress',
          dueDate: '2024-03-15',
          activities: [
            {
              id: 'activity3',
              name: 'Arrays and Lists',
              type: 'lesson',
              status: 'completed',
              score: 85,
              dueDate: '2024-03-01',
            },
            {
              id: 'activity4',
              name: 'Data Structures Assignment',
              type: 'assignment',
              status: 'in-progress',
              dueDate: '2024-03-08',
            },
          ],
        },
      ],
    },
    // Add more courses as needed
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'semester', label: 'This Semester' },
  ];

  const getStatusColor = (status: Course['status'] | Module['status'] | Activity['status']) => {
    switch (status) {
      case 'ahead':
      case 'completed':
        return 'success';
      case 'on-track':
      case 'in-progress':
        return 'primary';
      case 'behind':
      case 'not-started':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'lesson':
        return '📚';
      case 'quiz':
        return '✍️';
      case 'assignment':
        return '📝';
      case 'discussion':
        return '💭';
      default:
        return '📄';
    }
  };

  const courseDetailTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: selectedCourse && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <div className="text-sm text-gray-500">Overall Progress</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {selectedCourse.progress}%
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-sm text-gray-500">Current Grade</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {selectedCourse.grade || 'N/A'}
                </div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-sm text-gray-500">Status</div>
                <div className="mt-1">
                  <Badge variant={getStatusColor(selectedCourse.status)}>
                    {selectedCourse.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="space-y-4">
              <h3 className="font-medium">Course Timeline</h3>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Start: {selectedCourse.startDate}</span>
                <span>End: {selectedCourse.endDate}</span>
              </div>
              <Progress
                value={selectedCourse.progress}
                max={100}
                variant={getStatusColor(selectedCourse.status)}
                size="lg"
                showValue
              />
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'modules',
      label: 'Modules',
      content: selectedCourse && (
        <div className="space-y-6">
          {selectedCourse.modules.map((module) => (
            <Card key={module.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{module.name}</h3>
                    <p className="text-sm text-gray-500">Due: {module.dueDate}</p>
                  </div>
                  <Badge variant={getStatusColor(module.status)}>
                    {module.status}
                  </Badge>
                </div>

                <Progress
                  value={module.progress}
                  max={100}
                  variant={getStatusColor(module.status)}
                  size="sm"
                  showValue
                />

                <div className="space-y-2">
                  {module.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{getActivityIcon(activity.type)}</span>
                        <div>
                          <div className="font-medium">{activity.name}</div>
                          <div className="text-sm text-gray-500">Due: {activity.dueDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {activity.score && (
                          <span className="text-sm font-medium">
                            {activity.score}%
                          </span>
                        )}
                        <Badge variant={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
      <div className="flex justify-end">
        <div className="w-48">
          <Select
            options={timeframes}
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`cursor-pointer transition-all ${
              selectedCourse?.id === course.id ? 'ring-2 ring-indigo-500' : ''
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{course.name}</h3>
                  <p className="text-sm text-gray-500">
                    {course.startDate} - {course.endDate}
                  </p>
                </div>
                <Badge variant={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
              </div>

              <Progress
                value={course.progress}
                max={100}
                variant={getStatusColor(course.status)}
                size="md"
                showValue
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Completed Modules: </span>
                  <span className="font-medium">
                    {course.modules.filter((m) => m.status === 'completed').length}/{course.modules.length}
                  </span>
                </div>
                {course.grade && (
                  <div>
                    <span className="text-gray-500">Current Grade: </span>
                    <span className="font-medium">{course.grade}%</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCourse && (
        <Card title={selectedCourse.name}>
          <Tabs tabs={courseDetailTabs} />
        </Card>
      )}
    </div>
  );
};

export default ProgressTracker;
