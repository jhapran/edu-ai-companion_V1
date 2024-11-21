import { type FC, useState } from 'react';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Card from '../../../ui/Card';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AssignmentTask {
  id: string;
  description: string;
  points: number;
  type: 'essay' | 'problem' | 'project' | 'other';
}

interface AssignmentCreatorProps {
  onSave: (assignment: {
    title: string;
    description: string;
    dueDate: Date;
    totalPoints: number;
    tasks: AssignmentTask[];
    instructions: string;
    resources: string[];
  }) => void;
}

const AssignmentCreator: FC<AssignmentCreatorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [instructions, setInstructions] = useState('');
  const [resources, setResources] = useState<string[]>(['']);
  const [tasks, setTasks] = useState<AssignmentTask[]>([]);
  const [currentTask, setCurrentTask] = useState<Partial<AssignmentTask>>({
    type: 'essay',
  });

  const taskTypes = [
    { value: 'essay', label: 'Essay' },
    { value: 'problem', label: 'Problem Set' },
    { value: 'project', label: 'Project' },
    { value: 'other', label: 'Other' },
  ];

  const handleAddTask = () => {
    if (currentTask.description && currentTask.points) {
      const newTask: AssignmentTask = {
        id: Date.now().toString(),
        description: currentTask.description,
        points: currentTask.points,
        type: currentTask.type as AssignmentTask['type'],
      };

      setTasks([...tasks, newTask]);
      setCurrentTask({
        type: 'essay',
      });
    }
  };

  const handleAddResource = () => {
    setResources([...resources, '']);
  };

  const handleResourceChange = (index: number, value: string) => {
    const newResources = [...resources];
    newResources[index] = value;
    setResources(newResources);
  };

  const calculateTotalPoints = () => {
    return tasks.reduce((sum, task) => sum + task.points, 0);
  };

  const handleSaveAssignment = () => {
    if (title && dueDate && tasks.length > 0) {
      onSave({
        title,
        description,
        dueDate,
        totalPoints: calculateTotalPoints(),
        tasks,
        instructions,
        resources: resources.filter(r => r),
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card title="Assignment Details">
        <div className="space-y-4">
          <Input
            label="Assignment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter assignment title"
            fullWidth
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter assignment description"
            fullWidth
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholderText="Select due date and time"
            />
          </div>
        </div>
      </Card>

      <Card title="Tasks">
        <div className="space-y-4">
          <Select
            label="Task Type"
            value={currentTask.type}
            options={taskTypes}
            onChange={(e) => setCurrentTask({
              ...currentTask,
              type: e.target.value as AssignmentTask['type'],
            })}
            fullWidth
          />
          <Input
            label="Task Description"
            value={currentTask.description || ''}
            onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
            placeholder="Enter task description"
            fullWidth
          />
          <Input
            label="Points"
            type="number"
            value={currentTask.points || ''}
            onChange={(e) => setCurrentTask({ ...currentTask, points: parseInt(e.target.value) })}
            placeholder="Enter points for this task"
            fullWidth
          />
          <Button onClick={handleAddTask} variant="secondary" fullWidth>
            Add Task
          </Button>

          <div className="mt-4 space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Task {index + 1}: {task.type}</h4>
                    <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                  </div>
                  <span className="text-sm font-medium text-indigo-600">
                    {task.points} points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title="Instructions & Resources">
        <div className="space-y-4">
          <Input
            label="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter detailed instructions"
            fullWidth
          />
          
          <div className="space-y-2">
            {resources.map((resource, index) => (
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
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <div className="text-lg font-medium">
          Total Points: {calculateTotalPoints()}
        </div>
        <Button
          onClick={handleSaveAssignment}
          disabled={!title || !dueDate || tasks.length === 0}
        >
          Save Assignment
        </Button>
      </div>
    </div>
  );
};

export default AssignmentCreator;
