import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

interface Question {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isAnswered: boolean;
  votes: number;
  answers: Answer[];
}

interface Answer {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isAccepted: boolean;
}

interface QAPanelProps {
  currentUserId: string;
  onQuestionSubmit?: (question: string) => void;
  onAnswerSubmit?: (questionId: string, answer: string) => void;
  onQuestionVote?: (questionId: string) => void;
  onAnswerAccept?: (questionId: string, answerId: string) => void;
}

const QAPanel: React.FC<QAPanelProps> = ({
  currentUserId,
  onQuestionSubmit,
  onAnswerSubmit,
  onQuestionVote,
  onAnswerAccept
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswers, setNewAnswers] = useState<Record<string, string>>({});
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const question: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: newQuestion,
      author: {
        id: currentUserId,
        name: 'Current User', // In a real app, this would come from user data
        avatar: undefined
      },
      timestamp: new Date(),
      isAnswered: false,
      votes: 0,
      answers: []
    };

    setQuestions([...questions, question]);
    setNewQuestion('');
    onQuestionSubmit?.(newQuestion);
  };

  const handleAnswerSubmit = (questionId: string) => {
    const answerText = newAnswers[questionId];
    if (!answerText?.trim()) return;

    const answer: Answer = {
      id: Math.random().toString(36).substr(2, 9),
      text: answerText,
      author: {
        id: currentUserId,
        name: 'Current User', // In a real app, this would come from user data
        avatar: undefined
      },
      timestamp: new Date(),
      isAccepted: false
    };

    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, answer]
        };
      }
      return q;
    }));

    setNewAnswers({ ...newAnswers, [questionId]: '' });
    onAnswerSubmit?.(questionId, answerText);
  };

  const handleVote = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          votes: q.votes + 1
        };
      }
      return q;
    }));
    onQuestionVote?.(questionId);
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          isAnswered: true,
          answers: q.answers.map(a => ({
            ...a,
            isAccepted: a.id === answerId
          }))
        };
      }
      return q;
    }));
    onAnswerAccept?.(questionId, answerId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Question submission form */}
      <Card className="p-4 mb-4">
        <form onSubmit={handleQuestionSubmit} className="space-y-2">
          <Input
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full"
          />
          <Button type="submit" variant="primary">
            Ask Question
          </Button>
        </form>
      </Card>

      {/* Questions list */}
      <div className="flex-grow overflow-y-auto space-y-4">
        {questions.map(question => (
          <Card
            key={question.id}
            className={`p-4 ${selectedQuestion === question.id ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* Vote button */}
              <Button
                onClick={() => handleVote(question.id)}
                variant="ghost"
                className="flex flex-col items-center"
              >
                <span>▲</span>
                <span>{question.votes}</span>
              </Button>

              <div className="flex-grow">
                {/* Question header */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    src={question.author.avatar}
                    alt={question.author.name}
                    size="sm"
                  />
                  <span className="font-medium">{question.author.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(question.timestamp).toLocaleString()}
                  </span>
                  {question.isAnswered && (
                    <Badge variant="success">Answered</Badge>
                  )}
                </div>

                {/* Question text */}
                <p className="mb-4">{question.text}</p>

                {/* Answers */}
                <div className="space-y-4 ml-8">
                  {question.answers.map(answer => (
                    <div
                      key={answer.id}
                      className={`p-3 rounded-lg ${
                        answer.isAccepted ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar
                          src={answer.author.avatar}
                          alt={answer.author.name}
                          size="sm"
                        />
                        <span className="font-medium">{answer.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(answer.timestamp).toLocaleString()}
                        </span>
                        {answer.isAccepted && (
                          <Badge variant="success">Accepted Answer</Badge>
                        )}
                      </div>
                      <p>{answer.text}</p>
                      {!question.isAnswered && question.author.id === currentUserId && (
                        <Button
                          onClick={() => handleAcceptAnswer(question.id, answer.id)}
                          variant="ghost"
                          className="mt-2"
                        >
                          Accept Answer
                        </Button>
                      )}
                    </div>
                  ))}

                  {/* Answer input */}
                  <div className="flex gap-2">
                    <Input
                      value={newAnswers[question.id] || ''}
                      onChange={e => setNewAnswers({
                        ...newAnswers,
                        [question.id]: e.target.value
                      })}
                      placeholder="Write an answer..."
                      className="flex-grow"
                    />
                    <Button
                      onClick={() => handleAnswerSubmit(question.id)}
                      variant="primary"
                    >
                      Answer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QAPanel;
