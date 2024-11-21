import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import SearchBar from '../../components/shared/data/SearchBar';
import Select from '../../components/ui/Select';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: 'course' | 'resource' | 'template';
  rating: number;
  reviews: number;
  author: {
    id: string;
    name: string;
    rating: number;
  };
  thumbnail?: string;
  tags: string[];
  featured?: boolean;
  bestseller?: boolean;
}

interface ProductListProps {
  products: Product[];
  categories: string[];
  onProductSelect?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSortChange?: (sortBy: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  categories,
  onProductSelect,
  onAddToCart,
  onFilterChange,
  onSortChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleFilterChange = () => {
    onFilterChange?.({
      category: selectedCategory,
      type: selectedType,
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString()
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange?.(value);
  };

  const filteredProducts = products.filter(product =>
    (!searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!selectedCategory || product.category === selectedCategory) &&
    (!selectedType || product.type === selectedType) &&
    (product.price >= priceRange[0] && product.price <= priceRange[1])
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search products..."
          showSearchButton
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Category"
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              handleFilterChange();
            }}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
          />
          <Select
            label="Type"
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value);
              handleFilterChange();
            }}
            options={[
              { value: '', label: 'All Types' },
              { value: 'course', label: 'Course' },
              { value: 'resource', label: 'Resource' },
              { value: 'template', label: 'Template' }
            ]}
          />
          <Select
            label="Sort By"
            value={sortBy}
            onChange={e => handleSortChange(e.target.value)}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'newest', label: 'Newest' }
            ]}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[0]}
                onChange={e => {
                  setPriceRange([Number(e.target.value), priceRange[1]]);
                  handleFilterChange();
                }}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={e => {
                  setPriceRange([priceRange[0], Number(e.target.value)]);
                  handleFilterChange();
                }}
                className="w-full"
              />
              <span className="text-sm text-gray-500">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onProductSelect?.(product.id)}
          >
            {/* Product Image */}
            <div className="relative aspect-video bg-gray-100">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {product.featured && (
                <Badge
                  variant="primary"
                  className="absolute top-2 left-2"
                >
                  Featured
                </Badge>
              )}
              {product.bestseller && (
                <Badge
                  variant="success"
                  className="absolute top-2 right-2"
                >
                  Bestseller
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium line-clamp-2">{product.title}</h3>
                <Badge variant="secondary">{product.type}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">
                  {'★'.repeat(Math.round(product.rating))}
                  {'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.reviews})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>by {product.author.name}</span>
                <span>•</span>
                <span>{product.author.rating.toFixed(1)} ★</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    onAddToCart?.(product.id);
                  }}
                  variant="primary"
                  size="sm"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
