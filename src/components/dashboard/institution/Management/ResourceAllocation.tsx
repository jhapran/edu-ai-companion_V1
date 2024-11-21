import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Badge from '../../../../components/ui/Badge';
import Progress from '../../../../components/ui/Progress';
import DataGrid from '../../../../components/shared/data/DataGrid';
import SearchBar from '../../../../components/shared/data/SearchBar';

interface Resource {
  id: string;
  name: string;
  type: 'classroom' | 'laboratory' | 'equipment' | 'software';
  capacity?: number;
  availability: 'available' | 'in-use' | 'maintenance';
  assignedTo?: {
    id: string;
    name: string;
    type: 'course' | 'department' | 'faculty';
  };
  schedule?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  utilization: number;
  lastMaintenance?: Date;
  nextMaintenance?: Date;
}

interface ResourceAllocationProps {
  resources: Resource[];
  departments: string[];
  courses: Array<{ id: string; name: string }>;
  faculty: Array<{ id: string; name: string }>;
  onResourceCreate?: (resource: Omit<Resource, 'id'>) => void;
  onResourceUpdate?: (resourceId: string, updates: Partial<Resource>) => void;
  onResourceDelete?: (resourceId: string) => void;
  onScheduleUpdate?: (resourceId: string, schedule: Resource['schedule']) => void;
}

const ResourceAllocation: React.FC<ResourceAllocationProps> = ({
  resources,
  departments,
  courses,
  faculty,
  onResourceCreate,
  onResourceUpdate,
  onResourceDelete,
  onScheduleUpdate
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newResource, setNewResource] = useState<Omit<Resource, 'id'>>({
    name: '',
    type: 'classroom',
    capacity: 0,
    availability: 'available',
    utilization: 0,
    schedule: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleCreateResource = () => {
    if (!newResource.name.trim()) return;
    
    onResourceCreate?.(newResource);
    setNewResource({
      name: '',
      type: 'classroom',
      capacity: 0,
      availability: 'available',
      utilization: 0,
      schedule: []
    });
    setShowCreateForm(false);
  };

  const getAvailabilityBadgeVariant = (availability: Resource['availability']) => {
    switch (availability) {
      case 'available': return 'success';
      case 'in-use': return 'warning';
      case 'maintenance': return 'danger';
      default: return 'secondary';
    }
  };

  const columns = [
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'type', header: 'Type', sortable: true, filterable: true },
    { field: 'availability', header: 'Status', sortable: true },
    { field: 'utilization', header: 'Utilization', sortable: true },
    { field: 'assignedTo', header: 'Assigned To', sortable: true },
    { field: 'actions', header: 'Actions' }
  ];

  const filteredResources = resources.filter(resource =>
    Object.values(resource).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Allocation</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          Add New Resource
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search resources..."
            showSearchButton
          />
          <div className="flex gap-4">
            <Select
              label="Type Filter"
              options={[
                { value: '', label: 'All Types' },
                { value: 'classroom', label: 'Classroom' },
                { value: 'laboratory', label: 'Laboratory' },
                { value: 'equipment', label: 'Equipment' },
                { value: 'software', label: 'Software' }
              ]}
            />
            <Select
              label="Availability Filter"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'available', label: 'Available' },
                { value: 'in-use', label: 'In Use' },
                { value: 'maintenance', label: 'Maintenance' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Create Resource Form */}
      {showCreateForm && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
          <div className="space-y-4">
            <Input
              label="Resource Name"
              value={newResource.name}
              onChange={e => setNewResource({ ...newResource, name: e.target.value })}
              placeholder="Resource name"
              className="w-full"
            />
            <Select
              label="Resource Type"
              value={newResource.type}
              onChange={e => setNewResource({ ...newResource, type: e.target.value as Resource['type'] })}
              options={[
                { value: 'classroom', label: 'Classroom' },
                { value: 'laboratory', label: 'Laboratory' },
                { value: 'equipment', label: 'Equipment' },
                { value: 'software', label: 'Software' }
              ]}
            />
            {(newResource.type === 'classroom' || newResource.type === 'laboratory') && (
              <Input
                label="Capacity"
                type="number"
                value={newResource.capacity}
                onChange={e => setNewResource({ ...newResource, capacity: Number(e.target.value) })}
                min={0}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={handleCreateResource} variant="primary">
                Create Resource
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Resources Grid */}
      <DataGrid
        columns={columns}
        data={filteredResources.map(resource => ({
          ...resource,
          availability: (
            <Badge variant={getAvailabilityBadgeVariant(resource.availability)}>
              {resource.availability}
            </Badge>
          ),
          utilization: (
            <div className="w-32">
              <Progress value={resource.utilization} max={100} />
              <span className="text-sm text-gray-500">{resource.utilization}%</span>
            </div>
          ),
          assignedTo: resource.assignedTo ? (
            <div className="text-sm">
              <div>{resource.assignedTo.name}</div>
              <div className="text-gray-500">{resource.assignedTo.type}</div>
            </div>
          ) : (
            '-'
          ),
          actions: (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedResource(resource);
                  setShowScheduleModal(true);
                }}
                variant="secondary"
                size="sm"
              >
                Schedule
              </Button>
              <Button
                onClick={() => onResourceDelete?.(resource.id)}
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

export default ResourceAllocation;
