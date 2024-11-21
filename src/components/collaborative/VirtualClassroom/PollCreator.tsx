import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
}

interface PollCreatorProps {
  onPollCreate?: (poll: Omit<Poll, 'id'>) => void;
  onPollEnd?: (pollId: string) => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({
  onPollCreate,
  onPollEnd
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [activePolls, setActivePolls] = useState<Poll[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setError('A poll must have at least 2 options');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
    setError(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      setError('All options must be filled');
      return;
    }

    const newPoll = {
      question,
      options: options.map(text => ({
        id: Math.random().toString(36).substr(2, 9),
        text,
        votes: 0
      })),
      isActive: true
    };

    onPollCreate?.(newPoll);
    setActivePolls([...activePolls, { ...newPoll, id: Math.random().toString(36).substr(2, 9) }]);
    
    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setError(null);
  };

  const handleEndPoll = (pollId: string) => {
    onPollEnd?.(pollId);
    setActivePolls(activePolls.map(poll => 
      poll.id === pollId ? { ...poll, isActive: false } : poll
    ));
  };

  return (
    <div className="space-y-6">
      {/* Poll Creation Form */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Create New Poll</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <Input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Enter your question"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-grow"
                />
                <Button
                  onClick={() => handleRemoveOption(index)}
                  variant="secondary"
                  className="shrink-0"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={handleAddOption} variant="secondary">
              Add Option
            </Button>
            <Button onClick={handleCreatePoll} variant="primary">
              Create Poll
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Polls */}
      {activePolls.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Polls</h3>
          {activePolls.map(poll => (
            <Card key={poll.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">{poll.question}</h4>
                <Button
                  onClick={() => handleEndPoll(poll.id)}
                  variant="secondary"
                  disabled={!poll.isActive}
                >
                  {poll.isActive ? 'End Poll' : 'Ended'}
                </Button>
              </div>
              <div className="space-y-2">
                {poll.options.map(option => (
                  <div key={option.id} className="flex justify-between items-center">
                    <span>{option.text}</span>
                    <span className="text-sm text-gray-500">
                      {option.votes} votes
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollCreator;
