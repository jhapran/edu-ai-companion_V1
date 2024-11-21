import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Modal from '../../../ui/Modal';

interface Template {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'lesson' | 'assignment';
  structure: any; // Template structure will depend on the type
  thumbnail?: string;
  tags: string[];
}

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

const TemplateSelector: FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Sample templates - in a real app, these would come from an API
  const templates: Template[] = [
    {
      id: '1',
      title: 'Multiple Choice Quiz',
      description: 'A standard multiple choice quiz template with options for questions and answers.',
      type: 'quiz',
      structure: {
        questionTypes: ['multiple-choice'],
        sections: ['instructions', 'questions', 'feedback'],
      },
      thumbnail: '📝',
      tags: ['assessment', 'multiple-choice', 'basic'],
    },
    {
      id: '2',
      title: 'Interactive Lesson',
      description: 'An interactive lesson template with multimedia support and student activities.',
      type: 'lesson',
      structure: {
        sections: ['introduction', 'content', 'activity', 'summary'],
        features: ['multimedia', 'quizzes', 'discussion'],
      },
      thumbnail: '📚',
      tags: ['interactive', 'multimedia', 'comprehensive'],
    },
    {
      id: '3',
      title: 'Research Assignment',
      description: 'A template for creating research-based assignments with clear objectives and rubrics.',
      type: 'assignment',
      structure: {
        sections: ['objectives', 'requirements', 'resources', 'rubric'],
        components: ['submission', 'peer-review', 'feedback'],
      },
      thumbnail: '📋',
      tags: ['research', 'academic', 'advanced'],
    },
  ];

  const templateTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'lesson', label: 'Lessons' },
    { value: 'assignment', label: 'Assignments' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || template.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setPreviewModalOpen(true);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      setPreviewModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={templateTypes}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            fullWidth
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="text-4xl">{template.thumbnail}</div>
                <div className="text-sm font-medium text-indigo-600 capitalize">
                  {template.type}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {template.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {template.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={selectedTemplate?.title}
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <p className="text-gray-600">
              {selectedTemplate.description}
            </p>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Template Structure:</h4>
              <div className="space-y-2">
                {selectedTemplate.structure.sections && (
                  <div>
                    <p className="text-sm font-medium">Sections:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {selectedTemplate.structure.sections.map((section: string) => (
                        <li key={section} className="capitalize">{section}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedTemplate.structure.features && (
                  <div>
                    <p className="text-sm font-medium">Features:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {selectedTemplate.structure.features.map((feature: string) => (
                        <li key={feature} className="capitalize">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setPreviewModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmSelection}>
                Use Template
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplateSelector;
