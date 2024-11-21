import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import Alert from '../../../components/ui/Alert';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'image';
  url: string;
  uploadedBy: {
    id: string;
    name: string;
  };
  timestamp: Date;
  tags: string[];
  downloads: number;
}

interface ResourceSharingProps {
  resources: Resource[];
  onResourceUpload?: (resource: Omit<Resource, 'id' | 'timestamp' | 'downloads'>) => void;
  onResourceDownload?: (resourceId: string) => void;
  onResourceDelete?: (resourceId: string) => void;
  currentUserId: string;
}

const ResourceSharing: React.FC<ResourceSharingProps> = ({
  resources,
  onResourceUpload,
  onResourceDownload,
  onResourceDelete,
  currentUserId
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document' as Resource['type'],
    url: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Resource['type'] | 'all'>('all');

  const handleUpload = () => {
    if (!newResource.title.trim() || !newResource.url.trim()) {
      setError('Title and URL are required');
      return;
    }

    onResourceUpload?.({
      ...newResource,
      uploadedBy: {
        id: currentUserId,
        name: 'Current User', // In a real app, this would come from user data
      }
    });

    setNewResource({
      title: '',
      description: '',
      type: 'document',
      url: '',
      tags: [],
    });
    setShowUploadForm(false);
    setError(null);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (newResource.tags.includes(newTag.trim())) {
      setError('Tag already exists');
      return;
    }
    setNewResource({
      ...newResource,
      tags: [...newResource.tags, newTag.trim()]
    });
    setNewTag('');
    setError(null);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const filteredResources = resources.filter(resource => 
    filter === 'all' || resource.type === filter
  );

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return '📄';
      case 'video': return '🎥';
      case 'link': return '🔗';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button
          onClick={() => setShowUploadForm(true)}
          variant="primary"
        >
          Share Resource
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'document', 'video', 'link', 'image'].map(type => (
          <Button
            key={type}
            onClick={() => setFilter(type as typeof filter)}
            variant={filter === type ? 'primary' : 'secondary'}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Share New Resource</h3>
          <div className="space-y-4">
            <Input
              label="Title"
              value={newResource.title}
              onChange={e => setNewResource({ ...newResource, title: e.target.value })}
              placeholder="Resource title"
              className="w-full"
            />
            <Input
              label="Description"
              value={newResource.description}
              onChange={e => setNewResource({ ...newResource, description: e.target.value })}
              placeholder="Resource description"
              className="w-full"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newResource.type}
                onChange={e => setNewResource({ ...newResource, type: e.target.value as Resource['type'] })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
                <option value="image">Image</option>
              </select>
            </div>
            <Input
              label="URL"
              value={newResource.url}
              onChange={e => setNewResource({ ...newResource, url: e.target.value })}
              placeholder="Resource URL"
              className="w-full"
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-grow"
                />
                <Button onClick={handleAddTag} variant="secondary">
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newResource.tags.map(tag => (
                  <Button
                    key={tag}
                    variant="ghost"
                    className="text-sm bg-gray-100 hover:bg-gray-200"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Button>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpload} variant="primary">
                Upload
              </Button>
              <Button onClick={() => setShowUploadForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="p-4">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getResourceIcon(resource.type)}</span>
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-500">
                      by {resource.uploadedBy.name}
                    </p>
                  </div>
                </div>
                {resource.uploadedBy.id === currentUserId && (
                  <Button
                    onClick={() => onResourceDelete?.(resource.id)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </Button>
                )}
              </div>

              <p className="text-sm text-gray-600">{resource.description}</p>

              <div className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {resource.downloads} downloads
                </span>
                <Button
                  onClick={() => onResourceDownload?.(resource.id)}
                  variant="primary"
                >
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResourceSharing;
