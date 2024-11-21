import { type FC, useState, useRef, useEffect } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Badge from '../../../ui/Badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

interface Subject {
  id: string;
  name: string;
  topics: string[];
}

const AITutor: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample subjects data - in a real app, this would come from an API
  const subjects: Subject[] = [
    {
      id: 'math',
      name: 'Mathematics',
      topics: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    },
    {
      id: 'science',
      name: 'Science',
      topics: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    },
    {
      id: 'cs',
      name: 'Computer Science',
      topics: ['Programming', 'Data Structures', 'Algorithms', 'Web Development'],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response - in a real app, this would be an API call
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Here's a helpful explanation about ${inputMessage}...`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <Select
              options={subjects.map(subject => ({
                value: subject.id,
                label: subject.name,
              }))}
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('');
              }}
              placeholder="Select Subject"
            />
          </div>
          <div className="flex-1">
            <Select
              options={subjects
                .find(s => s.id === selectedSubject)
                ?.topics.map(topic => ({
                  value: topic,
                  label: topic,
                })) || []}
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="Select Topic"
              disabled={!selectedSubject}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`
                  max-w-[70%] rounded-lg p-4
                  ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }
                `}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.attachments && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <span>{attachment.type === 'image' ? '📷' : '📎'}</span>
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className={`
                  text-xs mt-2
                  ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}
                `}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your question..."
              fullWidth
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!inputMessage.trim()}>
            Send
          </Button>
        </div>
      </Card>

      <div className="mt-4">
        <Card>
          <div className="text-sm text-gray-500">
            <div className="font-medium mb-2">Quick Tips:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>Be specific with your questions</li>
              <li>Include relevant context</li>
              <li>Break down complex problems into smaller parts</li>
              <li>Use code blocks for programming questions</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AITutor;
