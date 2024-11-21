import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Badge from '../../../components/ui/Badge';
import SearchBar from '../../../components/shared/data/SearchBar';

interface Forum {
  id: string;
  title: string;
  description: string;
  category: string;
  threadCount: number;
  lastActivity: Date;
}

interface ForumListProps {
  onForumSelect?: (forumId: string) => void;
  onCreateForum?: (forum: Omit<Forum, 'id' | 'threadCount' | 'lastActivity'>) => void;
}

const ForumList: React.FC<ForumListProps> = ({
  onForumSelect,
  onCreateForum
}) => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newForum, setNewForum] = useState({
    title: '',
    description: '',
    category: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateForum = () => {
    if (!newForum.title.trim() || !newForum.description.trim() || !newForum.category.trim()) {
      return;
    }

    const forum: Forum = {
      id: Math.random().toString(36).substr(2, 9),
      ...newForum,
      threadCount: 0,
      lastActivity: new Date()
    };

    setForums([...forums, forum]);
    setNewForum({ title: '', description: '', category: '' });
    setShowCreateForm(false);
    onCreateForum?.(newForum);
  };

  const filteredForums = forums.filter(forum =>
    forum.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(forums.map(f => f.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussion Forums</h2>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          Create Forum
        </Button>
      </div>

      {/* Search */}
      <SearchBar
        onSearch={query => setSearchQuery(query)}
        placeholder="Search forums..."
        showSearchButton
      />

      {/* Create Forum Form */}
      {showCreateForm && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Create New Forum</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={newForum.title}
                onChange={e => setNewForum({ ...newForum, title: e.target.value })}
                placeholder="Forum title"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Input
                value={newForum.description}
                onChange={e => setNewForum({ ...newForum, description: e.target.value })}
                placeholder="Forum description"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Input
                value={newForum.category}
                onChange={e => setNewForum({ ...newForum, category: e.target.value })}
                placeholder="Forum category"
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateForum} variant="primary">
                Create
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Forums List */}
      <div className="space-y-4">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-2">{category}</h3>
            <div className="space-y-2">
              {filteredForums
                .filter(forum => forum.category === category)
                .map(forum => (
                  <Card
                    key={forum.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => onForumSelect?.(forum.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{forum.title}</h4>
                        <p className="text-sm text-gray-600">{forum.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="primary">
                          {forum.threadCount} threads
                        </Badge>
                        <span className="text-sm text-gray-500 mt-1">
                          Last activity: {forum.lastActivity.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumList;
