import React from 'react';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';
import Rating from './Rating';

interface ReviewAuthor {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface ReviewProps {
  id: string;
  author: ReviewAuthor;
  rating: number;
  title?: string;
  content: string;
  date: Date;
  helpful?: number;
  verified?: boolean;
  images?: string[];
  response?: {
    author: ReviewAuthor;
    content: string;
    date: Date;
  };
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  className?: string;
}

const Review: React.FC<ReviewProps> = ({
  id,
  author,
  rating,
  title,
  content,
  date,
  helpful = 0,
  verified = false,
  images = [],
  response,
  onHelpful,
  onReport,
  className = ''
}) => {
  return (
    <Card className={`p-4 ${className}`}>
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src={author.avatar}
            alt={author.name}
            size="md"
          />
          <div>
            <div className="font-medium">{author.name}</div>
            {author.role && (
              <div className="text-sm text-gray-500">{author.role}</div>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {date.toLocaleDateString()}
        </div>
      </div>

      {/* Rating and Title */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <Rating value={rating} readonly size="sm" />
          {verified && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Verified Purchase
            </span>
          )}
        </div>
        {title && (
          <h4 className="font-medium mt-1">{title}</h4>
        )}
      </div>

      {/* Review Content */}
      <div className="mt-3 text-gray-800">
        {content}
      </div>

      {/* Review Images */}
      {images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Review Actions */}
      <div className="mt-4 flex items-center gap-4">
        <Button
          onClick={() => onHelpful?.(id)}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="flex items-center gap-1">
            👍 Helpful ({helpful})
          </span>
        </Button>
        <Button
          onClick={() => onReport?.(id)}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          Report
        </Button>
      </div>

      {/* Response */}
      {response && (
        <div className="mt-4 pl-4 border-l-2 border-gray-200">
          <div className="flex items-center gap-2">
            <Avatar
              src={response.author.avatar}
              alt={response.author.name}
              size="sm"
            />
            <div>
              <div className="font-medium">{response.author.name}</div>
              <div className="text-sm text-gray-500">
                {response.date.toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="mt-2 text-gray-800">
            {response.content}
          </div>
        </div>
      )}
    </Card>
  );
};

export default Review;
