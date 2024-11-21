import { type FC, useState } from 'react';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Card from '../../../ui/Card';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
}

interface QuizGeneratorProps {
  onSave: (quiz: { title: string; description: string; questions: Question[] }) => void;
}

const QuizGenerator: FC<QuizGeneratorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    options: ['', '', '', ''],
  });

  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'true-false', label: 'True/False' },
    { value: 'short-answer', label: 'Short Answer' },
  ];

  const handleAddQuestion = () => {
    if (currentQuestion.text && currentQuestion.correctAnswer) {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text: currentQuestion.text,
        type: currentQuestion.type as Question['type'],
        options: currentQuestion.options,
        correctAnswer: currentQuestion.correctAnswer,
      };

      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        type: 'multiple-choice',
        options: ['', '', '', ''],
      });
    }
  };

  const handleSaveQuiz = () => {
    if (title && questions.length > 0) {
      onSave({
        title,
        description,
        questions,
      });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  return (
    <div className="space-y-6">
      <Card title="Quiz Details">
        <div className="space-y-4">
          <Input
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter quiz title"
            fullWidth
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter quiz description"
            fullWidth
          />
        </div>
      </Card>

      <Card title="Add Question">
        <div className="space-y-4">
          <Select
            label="Question Type"
            value={currentQuestion.type}
            options={questionTypes}
            onChange={(e) => setCurrentQuestion({
              ...currentQuestion,
              type: e.target.value as Question['type'],
              options: e.target.value === 'multiple-choice' ? ['', '', '', ''] : undefined,
            })}
            fullWidth
          />

          <Input
            label="Question Text"
            value={currentQuestion.text || ''}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
            placeholder="Enter your question"
            fullWidth
          />

          {currentQuestion.type === 'multiple-choice' && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <Input
                  key={index}
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Enter option ${index + 1}`}
                  fullWidth
                />
              ))}
            </div>
          )}

          <Input
            label="Correct Answer"
            value={currentQuestion.correctAnswer || ''}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
            placeholder="Enter the correct answer"
            fullWidth
          />

          <Button onClick={handleAddQuestion} variant="secondary" fullWidth>
            Add Question
          </Button>
        </div>
      </Card>

      <Card title="Questions">
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <h4 className="font-medium">Question {index + 1}</h4>
              <p className="mt-1">{question.text}</p>
              {question.options && (
                <ul className="mt-2 space-y-1">
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex} className="text-sm text-gray-600">
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-sm text-green-600">
                Correct Answer: {question.correctAnswer}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Button
        onClick={handleSaveQuiz}
        disabled={!title || questions.length === 0}
        fullWidth
      >
        Save Quiz
      </Button>
    </div>
  );
};

export default QuizGenerator;
