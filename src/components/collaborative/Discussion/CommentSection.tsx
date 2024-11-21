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

interface Comment {
  id: string;
  content: string;
  author: User;
  timestamp: Date;
  likes: number;
  isEdited: boolean;
  replies: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  currentUser: User;
  onCommentSubmit?: (content: string, parentId?: string) => void;
  onCommentEdit?: (commentId: string, content: string) => void;
  onCommentLike?: (commentId: string) => void;
  onCommentDelete?: (commentId: string) => void;
}

const CommentComponent: React.FC<{
  comment: Comment;
  currentUser: User;
  level?: number;
  onReply: (content: string, parentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onLike: (commentId: string) => void;
  onDelete: (commentId: string) => void;
}> = ({
  comment,
  currentUser,
  level = 0,
  onReply,
  onEdit,
  onLike,
  onDelete
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent, comment.id);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) return;
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className={`space-y-4 ${level > 0 ? 'ml-8' : ''}`}>
      <Card className="p-4">
        <div className="space-y-4">
          {/* Comment Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Avatar
                src={comment.author.avatar}
                alt={comment.author.name}
                size="sm"
              />
              <span className="font-medium">{comment.author.name}</span>
              <Badge variant="primary">{comment.author.role}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {comment.timestamp.toLocaleString()}
              </span>
              {comment.isEdited && (
                <span className="text-sm text-gray-500">(edited)</span>
              )}
            </div>
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="space-y-2">
              <TextArea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="w-full"
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleEditSubmit} variant="primary">
                  Save
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800">{comment.content}</p>
          )}

          {/* Comment Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => onLike(comment.id)}
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ♥ {comment.likes}
            </Button>
            <Button
              onClick={() => setIsReplying(!isReplying)}
              variant="ghost"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reply
            </Button>
            {comment.author.id === currentUser.id && (
              <>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="ghost"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(comment.id)}
                  variant="ghost"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Delete
                </Button>
              </>
            )}
          </div>

          {/* Reply Form */}
          {isReplying && (
            <div className="space-y-2">
              <TextArea
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full"
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleReplySubmit} variant="primary">
                  Post Reply
                </Button>
                <Button onClick={() => setIsReplying(false)} variant="secondary">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Nested Replies */}
      {comment.replies.map(reply => (
        <CommentComponent
          key={reply.id}
          comment={reply}
          currentUser={currentUser}
          level={level + 1}
          onReply={onReply}
          onEdit={onEdit}
          onLike={onLike}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUser,
  onCommentSubmit,
  onCommentEdit,
  onCommentLike,
  onCommentDelete
}) => {
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    onCommentSubmit?.(newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add a Comment</h3>
        <div className="space-y-4">
          <TextArea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full"
            rows={4}
          />
          <Button onClick={handleCommentSubmit} variant="primary">
            Post Comment
          </Button>
        </div>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentComponent
            key={comment.id}
            comment={comment}
            currentUser={currentUser}
            onReply={(content, parentId) => onCommentSubmit?.(content, parentId)}
            onEdit={onCommentEdit || (() => {})}
            onLike={onCommentLike || (() => {})}
            onDelete={onCommentDelete || (() => {})}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
