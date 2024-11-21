import { type FC, useState } from 'react';
import Card from '../../../ui/Card';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Select from '../../../ui/Select';
import Badge from '../../../ui/Badge';
import Avatar from '../../../ui/Avatar';
import Modal from '../../../ui/Modal';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor';
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: User;
  timestamp: string;
  topic: string;
  tags: string[];
  likes: number;
  replies: Reply[];
  isLiked?: boolean;
  isPinned?: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: User;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isAnswer?: boolean;
}

const DiscussionBoard: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Sample user data - in a real app, this would come from auth context
  const currentUser: User = {
    id: 'user1',
    name: 'John Doe',
    role: 'student',
  };

  // Sample posts data - in a real app, this would come from an API
  const posts: Post[] = [
    {
      id: 'post1',
      title: 'Help with Algorithm Complexity',
      content: 'I\'m having trouble understanding Big O notation. Can someone explain it in simple terms?',
      author: {
        id: 'user2',
        name: 'Alice Smith',
        role: 'student',
      },
      timestamp: '2024-03-20T10:30:00Z',
      topic: 'Algorithms',
      tags: ['algorithms', 'complexity', 'big-o'],
      likes: 5,
      isPinned: true,
      replies: [
        {
          id: 'reply1',
          content: 'Big O notation describes how the runtime or space requirements of an algorithm grow as the input size grows.',
          author: {
            id: 'user3',
            name: 'Prof. Johnson',
            role: 'instructor',
          },
          timestamp: '2024-03-20T11:00:00Z',
          likes: 3,
          isAnswer: true,
        },
      ],
    },
  ];

  const topics = [
    { value: 'all', label: 'All Topics' },
    { value: 'Algorithms', label: 'Algorithms' },
    { value: 'Data Structures', label: 'Data Structures' },
    { value: 'Programming', label: 'Programming' },
    { value: 'General', label: 'General Discussion' },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTopic = selectedTopic === 'all' || post.topic === selectedTopic;

    return matchesSearch && matchesTopic;
  });

  const handleCreatePost = () => {
    // In a real app, this would make an API call
    console.log('Creating post:', { title: newPostTitle, content: newPostContent });
    setShowNewPost(false);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleCreateReply = () => {
    // In a real app, this would make an API call
    console.log('Creating reply:', { content: replyContent });
    setReplyContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex gap-4">
          <Select
            options={topics}
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          />
          <Button onClick={() => setShowNewPost(true)}>
            New Discussion
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <Avatar
                    initials={post.author.name.split(' ').map(n => n[0]).join('')}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium">{post.author.name}</div>
                    <div className="text-sm text-gray-500">{formatDate(post.timestamp)}</div>
                  </div>
                </div>
                {post.isPinned && (
                  <Badge variant="primary">Pinned</Badge>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-gray-700 mt-1 line-clamp-2">{post.content}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{post.likes} likes</span>
                  <span>{post.replies.length} replies</span>
                </div>
                <span>{post.topic}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={showNewPost}
        onClose={() => setShowNewPost(false)}
        title="Create New Discussion"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Enter discussion title"
            fullWidth
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              className="w-full h-40 p-3 border rounded-lg resize-none"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What would you like to discuss?"
            />
          </div>
          <Select
            label="Topic"
            options={topics.filter(t => t.value !== 'all')}
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          />
          <div className="flex justify-end space-x-4">
            <Button variant="secondary" onClick={() => setShowNewPost(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!newPostTitle.trim() || !newPostContent.trim()}
            >
              Create Post
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title={selectedPost?.title}
        size="lg"
      >
        {selectedPost && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Avatar
                initials={selectedPost.author.name.split(' ').map(n => n[0]).join('')}
                size="md"
              />
              <div>
                <div className="font-medium">{selectedPost.author.name}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(selectedPost.timestamp)}
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p>{selectedPost.content}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedPost.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Replies</h3>
              <div className="space-y-4">
                {selectedPost.replies.map((reply) => (
                  <Card key={reply.id}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            initials={reply.author.name.split(' ').map(n => n[0]).join('')}
                            size="sm"
                          />
                          <div>
                            <div className="font-medium">{reply.author.name}</div>
                            <div className="text-sm text-gray-500">
                              {formatDate(reply.timestamp)}
                            </div>
                          </div>
                        </div>
                        {reply.isAnswer && (
                          <Badge variant="success">Best Answer</Badge>
                        )}
                      </div>
                      <p className="text-gray-700">{reply.content}</p>
                      <div className="text-sm text-gray-500">
                        {reply.likes} likes
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-4 space-y-4">
                <textarea
                  className="w-full h-24 p-3 border rounded-lg resize-none"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleCreateReply}
                    disabled={!replyContent.trim()}
                  >
                    Post Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DiscussionBoard;
