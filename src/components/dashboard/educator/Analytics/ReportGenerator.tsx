import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Select from '../../../ui/Select';
import Input from '../../../ui/Input';
import Modal from '../../../ui/Modal';
import Tabs from '../../../ui/Tabs';
import Progress from '../../../ui/Progress';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'performance' | 'engagement' | 'progress' | 'custom';
  sections: string[];
}

interface ReportGeneratorProps {
  courseId?: string;
}

const ReportGenerator: FC<ReportGeneratorProps> = ({ courseId }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Sample report templates - in a real app, these would come from an API
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'performance',
      name: 'Performance Report',
      description: 'Comprehensive analysis of student performance including grades, assessments, and trends.',
      type: 'performance',
      sections: [
        'Overall Performance Metrics',
        'Assessment Analysis',
        'Grade Distribution',
        'Improvement Trends',
      ],
    },
    {
      id: 'engagement',
      name: 'Engagement Report',
      description: 'Detailed insights into student engagement patterns and participation metrics.',
      type: 'engagement',
      sections: [
        'Participation Statistics',
        'Resource Usage',
        'Discussion Activity',
        'Time Spent Analysis',
      ],
    },
    {
      id: 'progress',
      name: 'Progress Report',
      description: 'Track student progress through course materials and learning objectives.',
      type: 'progress',
      sections: [
        'Learning Objectives Progress',
        'Module Completion Rates',
        'Skill Development',
        'Milestone Achievement',
      ],
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Create a customized report by selecting specific metrics and sections.',
      type: 'custom',
      sections: [],
    },
  ];

  const availableMetrics = [
    { value: 'grades', label: 'Grades & Assessments' },
    { value: 'attendance', label: 'Attendance & Participation' },
    { value: 'engagement', label: 'Student Engagement' },
    { value: 'progress', label: 'Learning Progress' },
    { value: 'feedback', label: 'Student Feedback' },
    { value: 'resources', label: 'Resource Utilization' },
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  const reportTabs = [
    {
      id: 'templates',
      label: 'Report Templates',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                selectedTemplate?.id === template.id ? 'ring-2 ring-indigo-500' : ''
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="space-y-3">
                <h3 className="text-lg font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.description}</p>
                {template.sections.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Included Sections:</p>
                    <ul className="list-disc list-inside">
                      {template.sections.map((section) => (
                        <li key={section}>{section}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: 'customize',
      label: 'Customize Report',
      content: (
        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="date"
                label="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Metrics to Include
              </label>
              <div className="space-y-2">
                {availableMetrics.map((metric) => (
                  <label key={metric.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={customSections.includes(metric.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCustomSections([...customSections, metric.value]);
                        } else {
                          setCustomSections(customSections.filter(s => s !== metric.value));
                        }
                      }}
                    />
                    <span className="text-sm text-gray-700">{metric.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedTemplate || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs tabs={reportTabs} />

      {/* Report Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Report Preview"
        size="xl"
      >
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedTemplate?.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Download PDF
                </Button>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Overall Performance</div>
                    <div className="text-2xl font-bold text-indigo-600">85%</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Student Engagement</div>
                    <div className="text-2xl font-bold text-green-600">92%</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500">Course Progress</div>
                    <div className="text-2xl font-bold text-blue-600">78%</div>
                  </div>
                </div>
              </div>

              {selectedTemplate?.sections.map((section) => (
                <div key={section} className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">{section}</h3>
                  <div className="space-y-4">
                    <Progress
                      value={Math.floor(Math.random() * 100)}
                      max={100}
                      variant="primary"
                      size="md"
                      showValue
                    />
                    <p className="text-sm text-gray-600">
                      Sample data visualization for {section.toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
            <Button>
              Generate Final Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportGenerator;
