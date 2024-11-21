import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import TextArea from '../../../../components/ui/TextArea';
import Badge from '../../../../components/ui/Badge';
import DataGrid from '../../../../components/shared/data/DataGrid';
import SearchBar from '../../../../components/shared/data/SearchBar';

interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  credits: number;
  instructor: {
    id: string;
    name: string;
  };
  status: 'active' | 'inactive' | 'draft';
  enrollmentCount: number;
  startDate: Date;
  endDate: Date;
}

interface CourseManagementProps {
  courses: Course[];
  departments: string[];
  instructors: Array<{ id: string; name: string }>;
  onCourseCreate?: (course: Omit<Course, 'id' | 'enrollmentCount'>) => void;
  onCourseUpdate?: (courseId: string, updates: Partial<Course>) => void;
  onCourseDelete?: (courseId: string) => void;
  onCourseStatusChange?: (courseId: string, status: Course['status']) => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  departments,
  instructors,
  onCourseCreate,
  onCourseUpdate,
  onCourseDelete,
  onCourseStatusChange
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    description: '',
    department: '',
    credits: 3,
    instructor: { id: '', name: '' },
    status: 'draft' as Course['status'],
    startDate: new Date(),
    endDate: new Date()
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateCourse = () => {
    if (!newCourse.code.trim() || !newCourse.title.trim()) return;
    
    onCourseCreate?.(newCourse);
    setNewCourse({
      code: '',
      title: '',
      description: '',
      department: '',
      credits: 3,
      instructor: { id: '', name: '' },
      status: 'draft',
      startDate: new Date(),
      endDate: new Date()
    });
    setShowCreateForm(false);
  };

  const columns = [
    { field: 'code', header: 'Code', sortable: true, filterable: true },
    { field: 'title', header: 'Title', sortable: true, filterable: true },
    { field: 'department', header: 'Department', sortable: true, filterable: true },
    { field: 'instructor', header: 'Instructor', sortable: true, filterable: true },
    { field: 'status', header: 'Status', sortable: true, filterable: true },
    { field: 'enrollmentCount', header: 'Enrollment', sortable: true },
    { field: 'actions', header: 'Actions' }
  ];

  const filteredCourses = courses.filter(course =>
    Object.values(course).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusBadgeVariant = (status: Course['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      case 'draft': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          Create New Course
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search courses..."
            showSearchButton
          />
          <div className="flex gap-4">
            <Select
              label="Department Filter"
              options={[
                { value: '', label: 'All Departments' },
                ...departments.map(dept => ({ value: dept, label: dept }))
              ]}
            />
            <Select
              label="Status Filter"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'draft', label: 'Draft' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Create Course Form */}
      {showCreateForm && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Create New Course</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Course Code"
                value={newCourse.code}
                onChange={e => setNewCourse({ ...newCourse, code: e.target.value })}
                placeholder="e.g., CS101"
              />
              <Input
                label="Credits"
                type="number"
                value={newCourse.credits}
                onChange={e => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                min={0}
              />
            </div>
            <Input
              label="Course Title"
              value={newCourse.title}
              onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
              placeholder="Course title"
              className="w-full"
            />
            <TextArea
              label="Description"
              value={newCourse.description}
              onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
              placeholder="Course description"
              rows={4}
            />
            <Select
              label="Department"
              value={newCourse.department}
              onChange={e => setNewCourse({ ...newCourse, department: e.target.value })}
              options={departments.map(dept => ({ value: dept, label: dept }))}
            />
            <Select
              label="Instructor"
              value={newCourse.instructor.id}
              onChange={e => {
                const instructor = instructors.find(i => i.id === e.target.value);
                setNewCourse({
                  ...newCourse,
                  instructor: instructor ? { id: instructor.id, name: instructor.name } : { id: '', name: '' }
                });
              }}
              options={instructors.map(instructor => ({
                value: instructor.id,
                label: instructor.name
              }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={newCourse.startDate.toISOString().split('T')[0]}
                onChange={e => setNewCourse({ ...newCourse, startDate: new Date(e.target.value) })}
              />
              <Input
                label="End Date"
                type="date"
                value={newCourse.endDate.toISOString().split('T')[0]}
                onChange={e => setNewCourse({ ...newCourse, endDate: new Date(e.target.value) })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCourse} variant="primary">
                Create Course
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Courses Grid */}
      <DataGrid
        columns={columns}
        data={filteredCourses.map(course => ({
          ...course,
          instructor: course.instructor.name,
          status: (
            <Badge variant={getStatusBadgeVariant(course.status)}>
              {course.status}
            </Badge>
          ),
          actions: (
            <div className="flex gap-2">
              <Button
                onClick={() => onCourseUpdate?.(course.id, course)}
                variant="secondary"
                size="sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => onCourseDelete?.(course.id)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          )
        }))}
        pageSize={10}
      />
    </div>
  );
};

export default CourseManagement;
