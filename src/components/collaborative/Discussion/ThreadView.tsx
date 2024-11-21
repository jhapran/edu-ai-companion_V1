import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import TextArea from '../../../components/ui/TextArea';
import Avatar from '../../../components/ui/Avatar';
import Badge from '../../../components/ui/Badge';

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

interface Post {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  likes: number;
  isEdited: boolean;
  attachments?: string[];
}

interface Thread {
  id: string;
  title: string;
  content: string;
  author: User;
  timestamp: Date;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  posts: Post[];
}

interface ThreadViewProps {
  thread?: Thread;
  currentUser: User;
  onReply?: (content: string) => void;
  onEdit?: (postId: string, content: string) => void;
  onLike?: (postId: string) => void;
  onPin?: () => void;
  onLock?: () => void;
  onBack?: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({
  thread,
  currentUser,
  onReply,
  onEdit,
  onLike,
  onPin,
  onLock,
  onBack
}) => {
  const [replyContent, setReplyContent] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  if (!thread) {
    return (
      <div className="text-center p-8">
        <p>Thread not found</p>
        <Button onClick={onBack} variant="primary" className="mt-4">
          Back to Forums
        </Button>
      </div>
    );
  }

  const handleReply = () => {
    if (!replyContent.trim()) return;
    onReply?.(replyContent);
    setReplyContent('');
  };

  const handleEdit = (postId: string) => {
    if (!editContent.trim()) return;
    onEdit?.(postId, editContent);
    setEditingPost(null);
    setEditContent('');
  };

  const startEditing = (post: Post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  return (
    <div className="space-y-6">
      {/* Thread Header */}
      <div className="flex justify-between items-start">
        <Button onClick={onBack} variant="ghost">
          ← Back to Forums
        </Button>
        <div className="flex gap-2">
          {currentUser.role === 'moderator' && (
            <>
              <Button
                onClick={onPin}
                variant={thread.isPinned ? 'primary' : 'secondary'}
              >
                {thread.isPinned ? 'Unpin' : 'Pin'} Thread
              </Button>
              <Button
                onClick={onLock}
                variant={thread.isLocked ? 'primary' : 'secondary'}
              >
                {thread.isLocked ? 'Unlock' : 'Lock'} Thread
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Thread Title and Info */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{thread.title}</h1>
            <div className="flex gap-2">
              {thread.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Avatar
                src={thread.author.avatar}
                alt={thread.author.name}
                size="sm"
              />
              <span>{thread.author.name}</span>
              <Badge variant="primary">{thread.author.role}</Badge>
            </div>
            <span>{thread.timestamp.toLocaleString()}</span>
            <span>{thread.views} views</span>
          </div>

          <div className="prose max-w-none">
            {thread.content}
          </div>
        </div>
      </Card>

      {/* Replies */}
      <div className="space-y-4">
        {thread.posts.map(post => (
          <Card key={post.id} className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={post.author.avatar}
                    alt={post.author.name}
                    size="sm"
                  />
                  <span className="font-medium">{post.author.name}</span>
                  <Badge variant="primary">{post.author.role}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {post.timestamp.toLocaleString()}
                  </span>
                  {post.isEdited && (
                    <span className="text-sm text-gray-500">(edited)</span>
                  )}
                </div>
              </div>

              {editingPost === post.id ? (
                <div className="space-y-2">
                  <TextArea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="w-full"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(post.id)} variant="primary">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingPost(null)}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {post.content}
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button
                  onClick={() => onLike?.(post.id)}
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-700"
                >
                  ♥ {post.likes}
                </Button>
                {post.author.id === currentUser.id && !editingPost && (
                  <Button
                    onClick={() => startEditing(post)}
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reply Form */}
      {!thread.isLocked && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Post a Reply</h3>
          <div className="space-y-4">
            <TextArea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              className="w-full"
              rows={4}
            />
            <Button onClick={handleReply} variant="primary">
              Post Reply
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ThreadView;
