import React from 'react';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';
import Rating from './Rating';
import Badge from '../../../components/ui/Badge';

interface TestimonialAuthor {
  name: string;
  title?: string;
  organization?: string;
  avatar?: string;
  badges?: string[];
}

interface TestimonialProps {
  author: TestimonialAuthor;
  content: string;
  rating?: number;
  date?: Date;
  featured?: boolean;
  variant?: 'default' | 'compact' | 'quote';
  imageUrl?: string;
  videoUrl?: string;
  className?: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  author,
  content,
  rating,
  date,
  featured = false,
  variant = 'default',
  imageUrl,
  videoUrl,
  className = ''
}) => {
  const renderMedia = () => {
    if (videoUrl) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Testimonial"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return null;
  };

  const renderQuoteIcon = () => (
    <svg
      className="absolute top-0 left-0 transform -translate-x-3 -translate-y-3 h-8 w-8 text-gray-200"
      fill="currentColor"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
    </svg>
  );

  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <div className="flex items-start gap-4">
            <Avatar
              src={author.avatar}
              alt={author.name}
              size="lg"
            />
            <div>
              <p className="text-gray-800 mb-2">{content}</p>
              <div>
                <div className="font-medium">{author.name}</div>
                {author.title && (
                  <div className="text-sm text-gray-500">
                    {author.title}
                    {author.organization && ` at ${author.organization}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="relative">
            {renderQuoteIcon()}
            <blockquote className="relative">
              <p className="text-xl font-medium text-gray-900 leading-8">
                {content}
              </p>
              <footer className="mt-4">
                <div className="flex items-center">
                  <Avatar
                    src={author.avatar}
                    alt={author.name}
                    size="md"
                  />
                  <div className="ml-4">
                    <div className="text-base font-medium text-gray-900">
                      {author.name}
                    </div>
                    {author.title && (
                      <div className="text-sm text-gray-500">
                        {author.title}
                        {author.organization && ` at ${author.organization}`}
                      </div>
                    )}
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        );

      default:
        return (
          <>
            {renderMedia()}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={author.avatar}
                    alt={author.name}
                    size="lg"
                  />
                  <div>
                    <div className="font-medium">{author.name}</div>
                    {author.title && (
                      <div className="text-sm text-gray-500">
                        {author.title}
                        {author.organization && ` at ${author.organization}`}
                      </div>
                    )}
                    {author.badges && (
                      <div className="flex gap-1 mt-1">
                        {author.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {date && (
                  <div className="text-sm text-gray-500">
                    {date.toLocaleDateString()}
                  </div>
                )}
              </div>

              {rating && (
                <div className="flex items-center gap-2">
                  <Rating value={rating} readonly size="sm" />
                  <span className="text-sm text-gray-500">
                    {rating.toFixed(1)} out of 5
                  </span>
                </div>
              )}

              <p className="text-gray-800">{content}</p>
            </div>
          </>
        );
    }
  };

  return (
    <Card
      className={`
        p-6
        ${featured ? 'border-2 border-indigo-500' : ''}
        ${className}
      `}
    >
      {featured && (
        <Badge variant="primary" className="mb-4">
          Featured Testimonial
        </Badge>
      )}
      {renderContent()}
    </Card>
  );
};

export default Testimonial;
