import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Badge from '../../../ui/Badge';
import Progress from '../../../ui/Progress';
import Modal from '../../../ui/Modal';
import Tabs from '../../../ui/Tabs';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'article' | 'quiz' | 'exercise';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  relevanceScore: number;
  thumbnail?: string;
  description: string;
  tags: string[];
  prerequisites: string[];
  completionRate?: number;
}

const ContentRecommendation: FC = () => {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample recommended content - in a real app, this would come from an API
  const recommendedContent: ContentItem[] = [
    {
      id: 'content1',
      title: 'Advanced Problem-Solving Techniques',
      type: 'video',
      category: 'Critical Thinking',
      difficulty: 'advanced',
      duration: 45,
      relevanceScore: 95,
      thumbnail: '🎥',
      description: 'Master advanced problem-solving strategies through real-world examples and practice exercises.',
      tags: ['problem-solving', 'critical-thinking', 'analysis'],
      prerequisites: ['Basic Problem Solving', 'Analytical Thinking'],
      completionRate: 0,
    },
    {
      id: 'content2',
      title: 'Data Analysis Fundamentals',
      type: 'article',
      category: 'Technical Skills',
      difficulty: 'intermediate',
      duration: 20,
      relevanceScore: 88,
      thumbnail: '📚',
      description: 'Learn the basics of data analysis including statistical concepts and visualization techniques.',
      tags: ['data-analysis', 'statistics', 'visualization'],
      prerequisites: ['Basic Math'],
      completionRate: 35,
    },
    {
      id: 'content3',
      title: 'Research Methods Quiz',
      type: 'quiz',
      category: 'Academic Skills',
      difficulty: 'intermediate',
      duration: 30,
      relevanceScore: 92,
      thumbnail: '✍️',
      description: 'Test your knowledge of research methods and methodologies.',
      tags: ['research', 'methodology', 'assessment'],
      prerequisites: ['Basic Research Concepts'],
      completionRate: 0,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Content' },
    { id: 'Critical Thinking', label: 'Critical Thinking' },
    { id: 'Technical Skills', label: 'Technical Skills' },
    { id: 'Academic Skills', label: 'Academic Skills' },
  ];

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'article':
        return '📚';
      case 'quiz':
        return '✍️';
      case 'exercise':
        return '💪';
      default:
        return '📄';
    }
  };

  const getDifficultyColor = (difficulty: ContentItem['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'primary';
      case 'advanced':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const filteredContent = recommendedContent.filter(
    content => activeCategory === 'all' || content.category === activeCategory
  );

  const contentDetailTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: selectedContent && (
        <div className="space-y-4">
          <div className="text-4xl mb-4">{selectedContent.thumbnail}</div>
          <p className="text-gray-700">{selectedContent.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Duration</div>
              <div className="font-medium">{selectedContent.duration} minutes</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Relevance Score</div>
              <div className="font-medium">{selectedContent.relevanceScore}%</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Prerequisites</h4>
            <div className="flex flex-wrap gap-2">
              {selectedContent.prerequisites.map((prereq) => (
                <Badge key={prereq} variant="secondary">
                  {prereq}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedContent.tags.map((tag) => (
                <Badge key={tag} variant="primary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'progress',
      label: 'Progress',
      content: selectedContent && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion Progress</span>
              <span>{selectedContent.completionRate}%</span>
            </div>
            <Progress
              value={selectedContent.completionRate || 0}
              max={100}
              variant="primary"
              size="lg"
            />
          </div>

          <Card>
            <div className="space-y-4">
              <h4 className="font-medium">Learning Milestones</h4>
              <div className="space-y-2">
                {['Introduction', 'Core Concepts', 'Practice', 'Assessment'].map((milestone, index) => (
                  <div key={milestone} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index <= (selectedContent.completionRate || 0) / 25
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200'
                    }`}>
                      {index + 1}
                    </div>
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'primary' : 'secondary'}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => (
          <Card
            key={content.id}
            onClick={() => {
              setSelectedContent(content);
              setShowDetails(true);
            }}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-3xl">{getTypeIcon(content.type)}</div>
                <Badge variant={getDifficultyColor(content.difficulty)}>
                  {content.difficulty}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-medium">{content.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {content.duration} minutes • {content.category}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Relevance</span>
                  <span>{content.relevanceScore}%</span>
                </div>
                <Progress
                  value={content.relevanceScore}
                  max={100}
                  variant="primary"
                  size="sm"
                />
              </div>

              {content.completionRate !== undefined && content.completionRate > 0 && (
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Progress</div>
                  <Progress
                    value={content.completionRate}
                    max={100}
                    variant="success"
                    size="sm"
                  />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={selectedContent?.title}
        size="lg"
      >
        <div className="space-y-6">
          <Tabs tabs={contentDetailTabs} />

          <div className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={() => setShowDetails(false)}>
              Close
            </Button>
            <Button>
              Start Learning
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentRecommendation;
