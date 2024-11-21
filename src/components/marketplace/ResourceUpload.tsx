import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Progress from '../../components/ui/Progress';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ResourceUploadProps {
  categories: string[];
  onUpload?: (resourceData: ResourceData, files: File[]) => Promise<{ success: boolean; error?: string }>;
  onSaveDraft?: (resourceData: ResourceData) => Promise<{ success: boolean; error?: string }>;
  onPreview?: (resourceData: ResourceData) => void;
}

interface ResourceData {
  title: string;
  description: string;
  type: 'course' | 'resource' | 'template';
  category: string;
  price: number;
  tags: string[];
  requirements?: string[];
  includes?: string[];
  thumbnail?: File;
  files: File[];
}

const ResourceUpload: React.FC<ResourceUploadProps> = ({
  categories,
  onUpload,
  onSaveDraft,
  onPreview
}) => {
  const [resourceData, setResourceData] = useState<ResourceData>({
    title: '',
    description: '',
    type: 'resource',
    category: '',
    price: 0,
    tags: [],
    requirements: [],
    includes: [],
    files: []
  });

  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newInclude, setNewInclude] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (e.target.name === 'thumbnail') {
      setResourceData(prev => ({
        ...prev,
        thumbnail: files[0]
      }));
    } else {
      setResourceData(prev => ({
        ...prev,
        files: [...prev.files, ...files]
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setResourceData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !resourceData.tags.includes(newTag.trim())) {
      setResourceData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setResourceData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setResourceData(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleAddInclude = () => {
    if (newInclude.trim()) {
      setResourceData(prev => ({
        ...prev,
        includes: [...(prev.includes || []), newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const validateForm = (): boolean => {
    if (!resourceData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!resourceData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!resourceData.category) {
      setError('Category is required');
      return false;
    }
    if (resourceData.price < 0) {
      setError('Price cannot be negative');
      return false;
    }
    if (resourceData.files.length === 0) {
      setError('At least one file is required');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    setIsUploading(true);
    setError(null);

    try {
      // Simulated upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const result = await onUpload?.(resourceData, resourceData.files);

      clearInterval(interval);
      setUploadProgress(100);

      if (!result?.success) {
        throw new Error(result?.error || 'Upload failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resource');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Upload Resource</h2>

        {/* Basic Information */}
        <div className="space-y-4">
          <Input
            label="Title"
            value={resourceData.title}
            onChange={e => setResourceData({ ...resourceData, title: e.target.value })}
            placeholder="Enter resource title"
          />

          <TextArea
            label="Description"
            value={resourceData.description}
            onChange={e => setResourceData({ ...resourceData, description: e.target.value })}
            placeholder="Describe your resource"
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Type"
              value={resourceData.type}
              onChange={e => setResourceData({ ...resourceData, type: e.target.value as ResourceData['type'] })}
              options={[
                { value: 'resource', label: 'Resource' },
                { value: 'course', label: 'Course' },
                { value: 'template', label: 'Template' }
              ]}
            />

            <Select
              label="Category"
              value={resourceData.category}
              onChange={e => setResourceData({ ...resourceData, category: e.target.value })}
              options={[
                { value: '', label: 'Select Category' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
            />
          </div>

          <Input
            label="Price"
            type="number"
            value={resourceData.price}
            onChange={e => setResourceData({ ...resourceData, price: Number(e.target.value) })}
            min={0}
            step={0.01}
          />
        </div>

        {/* Tags */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {resourceData.tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={e => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
          <ul className="list-disc list-inside mb-2">
            {resourceData.requirements?.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={newRequirement}
              onChange={e => setNewRequirement(e.target.value)}
              placeholder="Add a requirement"
              onKeyPress={e => e.key === 'Enter' && handleAddRequirement()}
            />
            <Button onClick={handleAddRequirement} variant="secondary">
              Add
            </Button>
          </div>
        </div>

        {/* Includes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
          <ul className="list-disc list-inside mb-2">
            {resourceData.includes?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              value={newInclude}
              onChange={e => setNewInclude(e.target.value)}
              placeholder="Add an item"
              onKeyPress={e => e.key === 'Enter' && handleAddInclude()}
            />
            <Button onClick={handleAddInclude} variant="secondary">
              Add
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
          />

          <label className="block text-sm font-medium text-gray-700 mb-2">Resource Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mb-4"
          />

          <div className="space-y-2">
            {resourceData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{file.name}</span>
                <Button
                  onClick={() => handleRemoveFile(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mt-6">
            {error}
          </Alert>
        )}

        {isUploading && (
          <div className="mt-6">
            <Progress value={uploadProgress} max={100} />
            <p className="text-sm text-gray-500 mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <div className="space-x-2">
            <Button
              onClick={() => onSaveDraft?.(resourceData)}
              variant="secondary"
              disabled={isUploading}
            >
              Save Draft
            </Button>
            <Button
              onClick={() => onPreview?.(resourceData)}
              variant="secondary"
              disabled={isUploading}
            >
              Preview
            </Button>
          </div>
          <Button
            onClick={handleUpload}
            variant="primary"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <LoadingSpinner className="mr-2" />
                Uploading...
              </>
            ) : (
              'Upload Resource'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResourceUpload;
