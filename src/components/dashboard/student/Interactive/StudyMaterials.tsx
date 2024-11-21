import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Badge from '../../../ui/Badge';
import Progress from '../../../ui/Progress';
import Modal from '../../../ui/Modal';

interface Material {
  id: string;
  title: string;
  type: 'document' | 'video' | 'audio' | 'interactive';
  format: string;
  subject: string;
  topic: string;
  description: string;
  url: string;
  thumbnail?: string;
  duration?: number;
  fileSize?: number;
  author: string;
  dateAdded: string;
  lastAccessed?: string;
  progress?: number;
  tags: string[];
}

const StudyMaterials: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Sample study materials - in a real app, this would come from an API
  const materials: Material[] = [
    {
      id: 'mat1',
      title: 'Introduction to Programming Concepts',
      type: 'document',
      format: 'PDF',
      subject: 'Computer Science',
      topic: 'Programming Basics',
      description: 'A comprehensive guide to basic programming concepts and principles.',
      url: '/materials/intro-programming.pdf',
      thumbnail: '📄',
      fileSize: 2.5,
      author: 'Dr. John Smith',
      dateAdded: '2024-02-15',
      lastAccessed: '2024-03-18',
      progress: 75,
      tags: ['programming', 'basics', 'computer science'],
    },
    {
      id: 'mat2',
      title: 'Data Structures Tutorial',
      type: 'video',
      format: 'MP4',
      subject: 'Computer Science',
      topic: 'Data Structures',
      description: 'Video tutorial explaining common data structures and their implementations.',
      url: '/materials/data-structures.mp4',
      thumbnail: '🎥',
      duration: 45,
      author: 'Prof. Sarah Johnson',
      dateAdded: '2024-03-01',
      lastAccessed: '2024-03-20',
      progress: 30,
      tags: ['data structures', 'algorithms', 'tutorial'],
    },
  ];

  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'document', label: 'Documents' },
    { value: 'video', label: 'Videos' },
    { value: 'audio', label: 'Audio' },
    { value: 'interactive', label: 'Interactive' },
  ];

  const getTypeIcon = (type: Material['type']) => {
    switch (type) {
      case 'document':
        return '📄';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎧';
      case 'interactive':
        return '🎮';
      default:
        return '📁';
    }
  };

  const formatFileSize = (size: number) => {
    return `${size} MB`;
  };

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex gap-4">
          <Select
            options={subjects}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          />
          <Select
            options={types}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <Card
            key={material.id}
            onClick={() => {
              setSelectedMaterial(material);
              setShowDetails(true);
            }}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-3xl">{getTypeIcon(material.type)}</div>
                <Badge variant="primary">{material.format}</Badge>
              </div>

              <div>
                <h3 className="text-lg font-medium">{material.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{material.subject} • {material.topic}</p>
              </div>

              {material.progress !== undefined && (
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{material.progress}%</span>
                  </div>
                  <Progress
                    value={material.progress}
                    max={100}
                    variant="primary"
                    size="sm"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={selectedMaterial?.title}
        size="lg"
      >
        {selectedMaterial && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium flex items-center space-x-2">
                  <span>{getTypeIcon(selectedMaterial.type)}</span>
                  <span className="capitalize">{selectedMaterial.type}</span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Format</div>
                <div className="font-medium">{selectedMaterial.format}</div>
              </div>
              {selectedMaterial.duration && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Duration</div>
                  <div className="font-medium">{formatDuration(selectedMaterial.duration)}</div>
                </div>
              )}
              {selectedMaterial.fileSize && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Size</div>
                  <div className="font-medium">{formatFileSize(selectedMaterial.fileSize)}</div>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-700">{selectedMaterial.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Author</span>
                  <span>{selectedMaterial.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date Added</span>
                  <span>{selectedMaterial.dateAdded}</span>
                </div>
                {selectedMaterial.lastAccessed && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Accessed</span>
                    <span>{selectedMaterial.lastAccessed}</span>
                  </div>
                )}
              </div>
            </div>

            {selectedMaterial.progress !== undefined && (
              <div>
                <h4 className="font-medium mb-2">Progress</h4>
                <Progress
                  value={selectedMaterial.progress}
                  max={100}
                  variant="primary"
                  size="lg"
                  showValue
                />
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <Button onClick={() => window.open(selectedMaterial.url, '_blank')}>
                Open Material
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudyMaterials;
