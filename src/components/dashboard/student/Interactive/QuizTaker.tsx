import { type FC, useState, useEffect } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Progress from '../../../ui/Progress';
import Badge from '../../../ui/Badge';
import Modal from '../../../ui/Modal';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  questions: Question[];
  totalPoints: number;
  passingScore: number;
}

interface QuizTakerProps {
  quizId?: string;
  onComplete?: (score: number, answers: Record<string, string>) => void;
}

const QuizTaker: FC<QuizTakerProps> = ({ quizId, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Sample quiz data - in a real app, this would come from an API
  const quiz: Quiz = {
    id: 'quiz1',
    title: 'Introduction to Programming',
    description: 'Test your knowledge of basic programming concepts',
    timeLimit: 30,
    questions: [
      {
        id: 'q1',
        text: 'What is a variable?',
        type: 'multiple-choice',
        options: [
          'A container for storing data values',
          'A mathematical equation',
          'A programming language',
          'A type of function',
        ],
        correctAnswer: 'A container for storing data values',
        explanation: 'Variables are used to store data values that can be used and modified throughout your program.',
        points: 10,
      },
      {
        id: 'q2',
        text: 'Is Python a compiled language?',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Python is an interpreted language, not a compiled language.',
        points: 5,
      },
      {
        id: 'q3',
        text: 'What is the main purpose of a function?',
        type: 'short-answer',
        correctAnswer: 'To organize and reuse code',
        explanation: 'Functions help in organizing code into reusable blocks that perform specific tasks.',
        points: 15,
      },
    ],
    totalPoints: 30,
    passingScore: 20,
  };

  useEffect(() => {
    if (quiz.timeLimit && !isSubmitted) {
      setTimeRemaining(quiz.timeLimit * 60);
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz.timeLimit, isSubmitted]);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [quiz.questions[currentQuestion].id]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()) {
        totalScore += question.points;
      }
    });
    return totalScore;
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    setShowResults(true);
    onComplete?.(finalScore, answers);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <button
                key={option}
                className={`
                  w-full p-4 text-left border rounded-lg transition-colors
                  ${
                    answers[question.id] === option
                      ? 'bg-indigo-50 border-indigo-500'
                      : 'hover:bg-gray-50'
                  }
                `}
                onClick={() => handleAnswer(option)}
                disabled={isSubmitted}
              >
                {option}
              </button>
            ))}
          </div>
        );
      case 'short-answer':
        return (
          <textarea
            className="w-full h-32 p-3 border rounded-lg resize-none"
            placeholder="Enter your answer..."
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            disabled={isSubmitted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{quiz.title}</h2>
            <p className="text-gray-500">{quiz.description}</p>
          </div>
          {timeRemaining !== null && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Time Remaining</div>
              <div className={`text-xl font-bold ${
                timeRemaining < 60 ? 'text-red-600' : ''
              }`}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </h3>
            <Badge variant="primary">
              {quiz.questions[currentQuestion].points} points
            </Badge>
          </div>

          <Progress
            value={currentQuestion + 1}
            max={quiz.questions.length}
            variant="primary"
            size="sm"
          />

          <div className="space-y-4">
            <p className="text-gray-700">{quiz.questions[currentQuestion].text}</p>
            {renderQuestion(quiz.questions[currentQuestion])}
          </div>

          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentQuestion === 0 || isSubmitted}
            >
              Previous
            </Button>
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitted}
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers[quiz.questions[currentQuestion].id] || isSubmitted}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        title="Quiz Results"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {score} / {quiz.totalPoints}
            </div>
            <Badge
              variant={score >= quiz.passingScore ? 'success' : 'danger'}
              size="lg"
            >
              {score >= quiz.passingScore ? 'Passed' : 'Failed'}
            </Badge>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <Card key={question.id}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <Badge
                      variant={
                        answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()
                          ? 'success'
                          : 'danger'
                      }
                    >
                      {answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()
                        ? `+${question.points}`
                        : '0'} points
                    </Badge>
                  </div>
                  <p className="text-gray-700">{question.text}</p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Your answer: </span>
                      <span className={
                        answers[question.id]?.toLowerCase() === question.correctAnswer.toLowerCase()
                          ? 'text-green-600'
                          : 'text-red-600'
                      }>
                        {answers[question.id] || 'Not answered'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Correct answer: </span>
                      <span className="text-green-600">{question.correctAnswer}</span>
                    </div>
                  </div>
                  {question.explanation && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Explanation: </span>
                      {question.explanation}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowResults(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizTaker;
