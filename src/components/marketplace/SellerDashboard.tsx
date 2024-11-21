import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Chart from '../../components/shared/data/Chart';
import DataGrid from '../../components/shared/data/DataGrid';
import Progress from '../../components/ui/Progress';
import SearchBar from '../../components/shared/data/SearchBar';
import Select from '../../components/ui/Select';

interface Product {
  id: string;
  title: string;
  type: 'course' | 'resource' | 'template';
  price: number;
  status: 'active' | 'draft' | 'archived';
  sales: number;
  revenue: number;
  rating: number;
  reviews: number;
  lastUpdated: Date;
}

interface SalesData {
  daily: Array<{
    date: Date;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    sales: number;
    revenue: number;
  }>;
  metrics: {
    totalSales: number;
    totalRevenue: number;
    averageRating: number;
    totalProducts: number;
  };
}

interface SellerDashboardProps {
  products: Product[];
  salesData: SalesData;
  onEditProduct?: (productId: string) => void;
  onCreateProduct?: () => void;
  onArchiveProduct?: (productId: string) => void;
  onUpdateStatus?: (productId: string, status: Product['status']) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  salesData,
  onEditProduct,
  onCreateProduct,
  onArchiveProduct,
  onUpdateStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Product['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Product['type'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'sales' | 'revenue' | 'rating'>('sales');

  const filteredProducts = products.filter(product =>
    (statusFilter === 'all' || product.status === statusFilter) &&
    (typeFilter === 'all' || product.type === typeFilter) &&
    (product.title.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => b[sortBy] - a[sortBy]);

  const columns = [
    { field: 'title', header: 'Product', sortable: true },
    { field: 'type', header: 'Type', sortable: true },
    { field: 'status', header: 'Status', sortable: true },
    { field: 'sales', header: 'Sales', sortable: true },
    { field: 'revenue', header: 'Revenue', sortable: true },
    { field: 'rating', header: 'Rating', sortable: true },
    { field: 'actions', header: 'Actions' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seller Dashboard</h2>
        <Button onClick={onCreateProduct} variant="primary">
          Create New Product
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold">{salesData.metrics.totalSales}</div>
            <div className="ml-2 text-sm text-gray-500">units</div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold">
              ${salesData.metrics.totalRevenue.toFixed(2)}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
          <div className="mt-2 flex items-center">
            <div className="text-2xl font-semibold">
              {salesData.metrics.averageRating.toFixed(1)}
            </div>
            <div className="ml-2 text-yellow-400">
              {'★'.repeat(Math.round(salesData.metrics.averageRating))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-semibold">{salesData.metrics.totalProducts}</div>
            <div className="ml-2 text-sm text-gray-500">active</div>
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Sales Overview</h3>
        <div className="h-64">
          <Chart
            type="line"
            data={{
              labels: salesData.daily.map(d => d.date.toLocaleDateString()),
              datasets: [
                {
                  label: 'Sales',
                  data: salesData.daily.map(d => d.sales)
                },
                {
                  label: 'Revenue',
                  data: salesData.daily.map(d => d.revenue)
                }
              ]
            }}
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Your Products</h3>
            <div className="flex gap-4">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="Search products..."
              />
              <Select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as Product['status'] | 'all')}
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'archived', label: 'Archived' }
                ]}
              />
              <Select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as Product['type'] | 'all')}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'course', label: 'Course' },
                  { value: 'resource', label: 'Resource' },
                  { value: 'template', label: 'Template' }
                ]}
              />
              <Select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                options={[
                  { value: 'sales', label: 'Sort by Sales' },
                  { value: 'revenue', label: 'Sort by Revenue' },
                  { value: 'rating', label: 'Sort by Rating' }
                ]}
              />
            </div>
          </div>

          <DataGrid
            columns={columns}
            data={filteredProducts.map(product => ({
              ...product,
              type: (
                <Badge variant="secondary">
                  {product.type}
                </Badge>
              ),
              status: (
                <Badge variant={
                  product.status === 'active' ? 'success' :
                  product.status === 'draft' ? 'warning' :
                  'secondary'
                }>
                  {product.status}
                </Badge>
              ),
              sales: (
                <div className="flex items-center gap-2">
                  <span>{product.sales}</span>
                  <Progress value={product.sales} max={Math.max(...products.map(p => p.sales))} />
                </div>
              ),
              revenue: `$${product.revenue.toFixed(2)}`,
              rating: (
                <div className="flex items-center gap-1">
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
              ),
              actions: (
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEditProduct?.(product.id)}
                    variant="secondary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Select
                    value={product.status}
                    onChange={e => onUpdateStatus?.(product.id, e.target.value as Product['status'])}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'archived', label: 'Archive' }
                    ]}
                  />
                </div>
              )
            }))}
            pageSize={10}
          />
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-4">
        <h3 className="font-medium mb-4">Top Performing Products</h3>
        <div className="space-y-4">
          {salesData.topProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{product.title}</div>
                <div className="text-sm text-gray-500">
                  {product.sales} sales • ${product.revenue.toFixed(2)} revenue
                </div>
              </div>
              <Button
                onClick={() => onEditProduct?.(product.id)}
                variant="secondary"
                size="sm"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SellerDashboard;
