import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Progress from '../../../ui/Progress';
import Badge from '../../../ui/Badge';
import Modal from '../../../ui/Modal';

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  progress: number;
  status: 'mastered' | 'in-progress' | 'not-started';
  prerequisites: string[];
  nextMilestones: string[];
}

interface Assessment {
  id: string;
  skillId: string;
  questions: {
    id: string;
    text: string;
    type: 'multiple-choice' | 'practical' | 'written';
    options?: string[];
    correctAnswer?: string;
  }[];
}

interface SkillAssessmentProps {
  studentId?: string;
}

const SkillAssessment: FC<SkillAssessmentProps> = ({ studentId }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Sample skills data - in a real app, this would come from an API
  const skills: Skill[] = [
    {
      id: 'skill1',
      name: 'Problem Solving',
      level: 3,
      category: 'Critical Thinking',
      progress: 75,
      status: 'in-progress',
      prerequisites: ['Basic Logic', 'Analytical Thinking'],
      nextMilestones: ['Advanced Problem Solving', 'Complex Problem Analysis'],
    },
    {
      id: 'skill2',
      name: 'Data Analysis',
      level: 2,
      category: 'Technical Skills',
      progress: 45,
      status: 'in-progress',
      prerequisites: ['Basic Math', 'Statistics Fundamentals'],
      nextMilestones: ['Advanced Data Visualization', 'Predictive Analytics'],
    },
    {
      id: 'skill3',
      name: 'Research Methods',
      level: 4,
      category: 'Academic Skills',
      progress: 90,
      status: 'mastered',
      prerequisites: ['Academic Writing', 'Information Literacy'],
      nextMilestones: ['Advanced Research Design', 'Research Publication'],
    },
  ];

  // Sample assessment data
  const assessments: Record<string, Assessment> = {
    skill1: {
      id: 'assessment1',
      skillId: 'skill1',
      questions: [
        {
          id: 'q1',
          text: 'How would you approach solving a complex problem?',
          type: 'multiple-choice',
          options: [
            'Break it down into smaller parts',
            'Try to solve it all at once',
            'Ask someone else to solve it',
            'Ignore the problem',
          ],
          correctAnswer: 'Break it down into smaller parts',
        },
        {
          id: 'q2',
          text: 'Describe a situation where you successfully solved a difficult problem.',
          type: 'written',
        },
      ],
    },
  };

  const getStatusColor = (status: Skill['status']) => {
    switch (status) {
      case 'mastered':
        return 'success';
      case 'in-progress':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const handleStartAssessment = (skill: Skill) => {
    setSelectedSkill(skill);
    setShowAssessment(true);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (currentQuestion < (assessments[selectedSkill?.id || '']?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const renderQuestion = (question: Assessment['questions'][0]) => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <button
                key={option}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  answers[question.id] === option
                    ? 'bg-indigo-50 border-indigo-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleAnswerSubmit(question.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'written':
        return (
          <div className="space-y-2">
            <textarea
              className="w-full h-32 p-3 border rounded-lg resize-none"
              placeholder="Enter your answer..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{skill.name}</h3>
                  <p className="text-sm text-gray-500">{skill.category}</p>
                </div>
                <Badge variant={getStatusColor(skill.status)}>
                  Level {skill.level}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{skill.progress}%</span>
                </div>
                <Progress
                  value={skill.progress}
                  max={100}
                  variant={getStatusColor(skill.status)}
                  size="sm"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Next Milestones:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {skill.nextMilestones.map((milestone) => (
                    <li key={milestone} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2" />
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleStartAssessment(skill)}
                variant="secondary"
                fullWidth
              >
                Start Assessment
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showAssessment}
        onClose={() => setShowAssessment(false)}
        title={`${selectedSkill?.name} Assessment`}
        size="lg"
      >
        {selectedSkill && (
          <div className="space-y-6">
            <Progress
              value={currentQuestion + 1}
              max={assessments[selectedSkill.id]?.questions.length || 1}
              variant="primary"
              size="sm"
            />

            <div className="space-y-4">
              <p className="text-lg font-medium">
                Question {currentQuestion + 1} of {assessments[selectedSkill.id]?.questions.length}
              </p>
              <p className="text-gray-700">
                {assessments[selectedSkill.id]?.questions[currentQuestion]?.text}
              </p>

              {renderQuestion(assessments[selectedSkill.id]?.questions[currentQuestion])}
            </div>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (currentQuestion === assessments[selectedSkill.id]?.questions.length - 1) {
                    setShowAssessment(false);
                    // Here you would typically submit the assessment
                  } else {
                    setCurrentQuestion(currentQuestion + 1);
                  }
                }}
              >
                {currentQuestion === assessments[selectedSkill.id]?.questions.length - 1
                  ? 'Submit'
                  : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SkillAssessment;
