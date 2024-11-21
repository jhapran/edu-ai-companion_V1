import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Progress from '../../components/ui/Progress';
import Avatar from '../../components/ui/Avatar';

interface Review {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'course' | 'resource' | 'template';
  rating: number;
  reviews: Review[];
  author: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalSales: number;
    products: number;
  };
  thumbnail?: string;
  tags: string[];
  featured?: boolean;
  bestseller?: boolean;
  details: {
    overview: string;
    features: string[];
    specifications?: Record<string, string>;
    requirements?: string[];
    includes?: string[];
  };
  stats: {
    purchases: number;
    views: number;
    downloads: number;
    ratingBreakdown: Record<number, number>;
  };
}

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  onAddToCart?: (productId: string) => void;
  onBuyNow?: (productId: string) => void;
  onReviewHelpful?: (reviewId: string) => void;
  onBack?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  relatedProducts,
  onAddToCart,
  onBuyNow,
  onReviewHelpful,
  onBack
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const totalReviews = Object.values(product.stats.ratingBreakdown).reduce((a, b) => a + b, 0);

  const renderReviews = () => (
    <div className="space-y-6">
      {/* Rating Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center gap-2">
              <span className="w-12">{rating} stars</span>
              <Progress
                value={product.stats.ratingBreakdown[rating] || 0}
                max={totalReviews}
                className="flex-grow"
              />
              <span className="w-12 text-right">
                {Math.round(((product.stats.ratingBreakdown[rating] || 0) / totalReviews) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {product.reviews.map(review => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={review.author.avatar}
                  alt={review.author.name}
                  size="sm"
                />
                <div>
                  <div className="font-medium">{review.author.name}</div>
                  <div className="text-sm text-gray-500">
                    {review.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-yellow-400">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>
            <p className="mt-2">{review.comment}</p>
            <div className="mt-2 flex items-center gap-2">
              <Button
                onClick={() => onReviewHelpful?.(review.id)}
                variant="ghost"
                size="sm"
              >
                👍 Helpful ({review.helpful})
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSpecifications = () => (
    <div className="grid grid-cols-2 gap-4">
      {product.details.specifications && Object.entries(product.details.specifications).map(([key, value]) => (
        <div key={key} className="flex justify-between">
          <span className="font-medium">{key}:</span>
          <span>{value}</span>
        </div>
      ))}
    </div>
  );

  const renderFeatures = () => (
    <ul className="space-y-2">
      {product.details.features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-green-500">✓</span>
          {feature}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Button onClick={onBack} variant="ghost">
        ← Back to Products
      </Button>

      {/* Product Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {product.featured && (
            <Badge variant="primary" className="absolute top-4 left-4">
              Featured
            </Badge>
          )}
          {product.bestseller && (
            <Badge variant="success" className="absolute top-4 right-4">
              Bestseller
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <Badge variant="secondary">{product.type}</Badge>
            </div>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <span className="text-lg font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-gray-500">({product.reviews.length} reviews)</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">{product.stats.purchases} purchases</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Avatar
              src={product.author.avatar}
              alt={product.author.name}
              size="lg"
            />
            <div>
              <div className="font-medium">{product.author.name}</div>
              <div className="text-sm text-gray-500">
                {product.author.rating.toFixed(1)} ★ • {product.author.totalSales} sales • {product.author.products} products
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            <div className="flex gap-2">
              <Button onClick={() => onAddToCart?.(product.id)} variant="secondary">
                Add to Cart
              </Button>
              <Button onClick={() => onBuyNow?.(product.id)} variant="primary">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <Card className="p-6">
        <Tabs
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              content: <div className="prose max-w-none">{product.details.overview}</div>
            },
            {
              id: 'features',
              label: 'Features',
              content: renderFeatures()
            },
            {
              id: 'specifications',
              label: 'Specifications',
              content: renderSpecifications()
            },
            {
              id: 'reviews',
              label: 'Reviews',
              content: renderReviews()
            }
          ]}
          defaultTab={selectedTab}
          onChange={setSelectedTab}
        />
      </Card>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {relatedProducts.map(product => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-gray-100">
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium line-clamp-2">{product.title}</h3>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    <div className="text-yellow-400 text-sm">
                      {'★'.repeat(Math.round(product.rating))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
