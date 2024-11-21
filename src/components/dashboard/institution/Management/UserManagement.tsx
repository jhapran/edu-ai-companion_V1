import React, { useState } from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Select from '../../../../components/ui/Select';
import Badge from '../../../../components/ui/Badge';
import DataGrid from '../../../../components/shared/data/DataGrid';
import SearchBar from '../../../../components/shared/data/SearchBar';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator' | 'admin';
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: Date;
}

interface UserManagementProps {
  users: User[];
  onUserCreate?: (user: Omit<User, 'id'>) => void;
  onUserUpdate?: (userId: string, updates: Partial<User>) => void;
  onUserDelete?: (userId: string) => void;
  onUserStatusChange?: (userId: string, status: User['status']) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onUserStatusChange
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as User['role'],
    department: '',
    status: 'pending' as User['status']
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    
    onUserCreate?.(newUser);
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      department: '',
      status: 'pending'
    });
    setShowCreateForm(false);
  };

  const columns = [
    { field: 'name', header: 'Name', sortable: true, filterable: true },
    { field: 'email', header: 'Email', sortable: true, filterable: true },
    { field: 'role', header: 'Role', sortable: true, filterable: true },
    { field: 'department', header: 'Department', sortable: true, filterable: true },
    { field: 'status', header: 'Status', sortable: true, filterable: true },
    { field: 'lastLogin', header: 'Last Login', sortable: true }
  ];

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search users..."
            showSearchButton
          />
          <div className="flex gap-4">
            <Select
              label="Role Filter"
              options={[
                { value: '', label: 'All Roles' },
                { value: 'student', label: 'Student' },
                { value: 'educator', label: 'Educator' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
            <Select
              label="Status Filter"
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Create User Form */}
      {showCreateForm && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Add New User</h3>
          <div className="space-y-4">
            <Input
              label="Name"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Full name"
              className="w-full"
            />
            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Email address"
              className="w-full"
            />
            <Select
              label="Role"
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'educator', label: 'Educator' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
            <Input
              label="Department"
              value={newUser.department}
              onChange={e => setNewUser({ ...newUser, department: e.target.value })}
              placeholder="Department"
              className="w-full"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateUser} variant="primary">
                Create User
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Users Grid */}
      <DataGrid
        columns={columns}
        data={filteredUsers.map(user => ({
          ...user,
          status: (
            <Badge variant={getStatusBadgeVariant(user.status)}>
              {user.status}
            </Badge>
          ),
          lastLogin: user.lastLogin?.toLocaleString() || 'Never'
        }))}
        pageSize={10}
        onRowClick={row => onUserUpdate?.(row.id, row)}
      />
    </div>
  );
};

export default UserManagement;
