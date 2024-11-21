import { type FC, useState } from 'react';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Card from '../../../ui/Card';
import Tabs from '../../../ui/Tabs';
import { type ReactNode } from 'react';

interface LessonSection {
  id: string;
  title: string;
  content: string;
  duration: number;
  type: 'introduction' | 'main-content' | 'activity' | 'assessment' | 'conclusion';
  resources: string[];
}

interface LessonPlanBuilderProps {
  onSave: (lessonPlan: {
    title: string;
    subject: string;
    gradeLevel: string;
    objectives: string[];
    sections: LessonSection[];
  }) => void;
}

const LessonPlanBuilder: FC<LessonPlanBuilderProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['']);
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [currentSection, setCurrentSection] = useState<Partial<LessonSection>>({
    type: 'introduction',
    resources: [''],
  });

  const sectionTypes = [
    { value: 'introduction', label: 'Introduction' },
    { value: 'main-content', label: 'Main Content' },
    { value: 'activity', label: 'Activity' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'conclusion', label: 'Conclusion' },
  ];

  const handleAddObjective = () => {
    setObjectives([...objectives, '']);
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const handleAddSection = () => {
    if (currentSection.title && currentSection.content) {
      const newSection: LessonSection = {
        id: Date.now().toString(),
        title: currentSection.title,
        content: currentSection.content,
        duration: currentSection.duration || 0,
        type: currentSection.type as LessonSection['type'],
        resources: currentSection.resources?.filter(r => r) || [],
      };

      setSections([...sections, newSection]);
      setCurrentSection({
        type: 'introduction',
        resources: [''],
      });
    }
  };

  const handleAddResource = () => {
    setCurrentSection({
      ...currentSection,
      resources: [...(currentSection.resources || []), ''],
    });
  };

  const handleResourceChange = (index: number, value: string) => {
    const newResources = [...(currentSection.resources || [])];
    newResources[index] = value;
    setCurrentSection({ ...currentSection, resources: newResources });
  };

  const handleSaveLessonPlan = () => {
    if (title && subject && gradeLevel && objectives.length > 0) {
      onSave({
        title,
        subject,
        gradeLevel,
        objectives: objectives.filter(obj => obj),
        sections,
      });
    }
  };

  const renderTabContent = (label: string, content: ReactNode) => (
    <Card title={label}>
      {content}
    </Card>
  );

  const tabs = [
    {
      id: 'details',
      label: 'Basic Details',
      content: renderTabContent('Lesson Details', (
        <div className="space-y-4">
          <Input
            label="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title"
            fullWidth
          />
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            fullWidth
          />
          <Input
            label="Grade Level"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="Enter grade level"
            fullWidth
          />
        </div>
      )),
    },
    {
      id: 'objectives',
      label: 'Objectives',
      content: renderTabContent('Learning Objectives', (
        <div className="space-y-4">
          {objectives.map((objective, index) => (
            <Input
              key={index}
              label={`Objective ${index + 1}`}
              value={objective}
              onChange={(e) => handleObjectiveChange(index, e.target.value)}
              placeholder="Enter learning objective"
              fullWidth
            />
          ))}
          <Button onClick={handleAddObjective} variant="secondary">
            Add Objective
          </Button>
        </div>
      )),
    },
    {
      id: 'sections',
      label: 'Sections',
      content: renderTabContent('Lesson Sections', (
        <div className="space-y-6">
          <div className="space-y-4">
            <Select
              label="Section Type"
              value={currentSection.type}
              options={sectionTypes}
              onChange={(e) => setCurrentSection({
                ...currentSection,
                type: e.target.value as LessonSection['type'],
              })}
              fullWidth
            />
            <Input
              label="Section Title"
              value={currentSection.title || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
              placeholder="Enter section title"
              fullWidth
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={currentSection.duration || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, duration: parseInt(e.target.value) })}
              placeholder="Enter duration in minutes"
              fullWidth
            />
            <Input
              label="Content"
              value={currentSection.content || ''}
              onChange={(e) => setCurrentSection({ ...currentSection, content: e.target.value })}
              placeholder="Enter section content"
              fullWidth
            />
            <div className="space-y-2">
              {currentSection.resources?.map((resource, index) => (
                <Input
                  key={index}
                  label={`Resource ${index + 1}`}
                  value={resource}
                  onChange={(e) => handleResourceChange(index, e.target.value)}
                  placeholder="Enter resource URL or description"
                  fullWidth
                />
              ))}
              <Button onClick={handleAddResource} variant="secondary">
                Add Resource
              </Button>
            </div>
            <Button onClick={handleAddSection} variant="secondary" fullWidth>
              Add Section
            </Button>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <Card
                key={section.id}
                title={`${index + 1}. ${section.title}`}
                subtitle={`${section.type} - ${section.duration} minutes`}
              >
                <div className="space-y-2">
                  <p>{section.content}</p>
                  {section.resources.length > 0 && (
                    <div>
                      <h4 className="font-medium">Resources:</h4>
                      <ul className="list-disc list-inside">
                        {section.resources.map((resource, i) => (
                          <li key={i} className="text-sm text-gray-600">{resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={tabs} />
      <Button
        onClick={handleSaveLessonPlan}
        disabled={!title || !subject || !gradeLevel || objectives.length === 0}
        fullWidth
      >
        Save Lesson Plan
      </Button>
    </div>
  );
};

export default LessonPlanBuilder;
