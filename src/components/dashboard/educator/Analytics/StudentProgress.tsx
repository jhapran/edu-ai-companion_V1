import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Progress from '../../../ui/Progress';
import Select from '../../../ui/Select';
import Input from '../../../ui/Input';
import Badge from '../../../ui/Badge';
import Tabs from '../../../ui/Tabs';

interface Student {
  id: string;
  name: string;
  email: string;
  overallProgress: number;
  status: 'on-track' | 'at-risk' | 'falling-behind';
  modules: {
    id: string;
    name: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'not-started';
    grade?: number;
  }[];
  assessments: {
    id: string;
    name: string;
    type: 'quiz' | 'assignment' | 'exam';
    score: number;
    maxScore: number;
    submittedDate: string;
  }[];
  activityLog: {
    date: string;
    type: string;
    description: string;
  }[];
}

interface StudentProgressProps {
  courseId?: string;
}

const StudentProgress: FC<StudentProgressProps> = ({ courseId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample student data - in a real app, this would come from an API
  const students: Student[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      overallProgress: 85,
      status: 'on-track',
      modules: [
        { id: 'm1', name: 'Introduction', progress: 100, status: 'completed', grade: 92 },
        { id: 'm2', name: 'Basic Concepts', progress: 75, status: 'in-progress' },
        { id: 'm3', name: 'Advanced Topics', progress: 0, status: 'not-started' },
      ],
      assessments: [
        { id: 'a1', name: 'Quiz 1', type: 'quiz', score: 90, maxScore: 100, submittedDate: '2024-03-15' },
        { id: 'a2', name: 'Assignment 1', type: 'assignment', score: 85, maxScore: 100, submittedDate: '2024-03-10' },
      ],
      activityLog: [
        { date: '2024-03-15', type: 'quiz_submission', description: 'Completed Quiz 1' },
        { date: '2024-03-10', type: 'assignment_submission', description: 'Submitted Assignment 1' },
      ],
    },
    // Add more sample students as needed
  ];

  const statusFilters = [
    { value: 'all', label: 'All Students' },
    { value: 'on-track', label: 'On Track' },
    { value: 'at-risk', label: 'At Risk' },
    { value: 'falling-behind', label: 'Falling Behind' },
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Student['status']) => {
    switch (status) {
      case 'on-track':
        return 'success';
      case 'at-risk':
        return 'warning';
      case 'falling-behind':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getModuleStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'not-started':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const studentDetailTabs = [
    {
      id: 'modules',
      label: 'Modules',
      content: (
        <div className="space-y-4">
          {selectedStudent?.modules.map(module => (
            <Card key={module.id}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{module.name}</h4>
                  <Badge variant={getModuleStatusBadgeVariant(module.status)}>
                    {module.status}
                  </Badge>
                </div>
                <Progress
                  value={module.progress}
                  max={100}
                  size="sm"
                  variant="primary"
                  showValue
                />
                {module.grade && (
                  <div className="text-sm text-gray-600">
                    Grade: {module.grade}%
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'assessments',
      label: 'Assessments',
      content: (
        <div className="space-y-4">
          {selectedStudent?.assessments.map(assessment => (
            <Card key={assessment.id}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{assessment.name}</h4>
                  <p className="text-sm text-gray-500">
                    Submitted: {assessment.submittedDate}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    {assessment.score}/{assessment.maxScore}
                  </div>
                  <Badge variant="primary">
                    {assessment.type}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'activity',
      label: 'Activity Log',
      content: (
        <div className="space-y-4">
          {selectedStudent?.activityLog.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={statusFilters}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1 space-y-4">
          {filteredStudents.map(student => (
            <Card
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className={`transition-colors ${selectedStudent?.id === student.id ? 'ring-2 ring-indigo-500' : ''}`}
              hoverable
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(student.status)}>
                    {student.status.replace('-', ' ')}
                  </Badge>
                </div>
                <Progress
                  value={student.overallProgress}
                  max={100}
                  size="sm"
                  variant="primary"
                  showValue
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="space-y-6">
              <Card>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-medium">{selectedStudent.name}</h2>
                      <p className="text-gray-500">{selectedStudent.email}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(selectedStudent.status)} size="lg">
                      {selectedStudent.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">
                      Overall Progress
                    </div>
                    <Progress
                      value={selectedStudent.overallProgress}
                      max={100}
                      size="lg"
                      variant="primary"
                      showValue
                    />
                  </div>
                </div>
              </Card>

              <Tabs tabs={studentDetailTabs} />
            </div>
          ) : (
            <Card>
              <div className="text-center text-gray-500 py-8">
                Select a student to view detailed progress
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
