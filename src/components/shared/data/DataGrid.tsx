import React, { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';

interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
}

interface DataGridProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  pageSize?: number;
}

const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  onRowClick,
  pageSize = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter data
  const filteredData = data.filter(row => {
    return Object.entries(filters).every(([field, value]) => {
      if (!value) return true;
      const cellValue = String(row[field]).toLowerCase();
      return cellValue.includes(value.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilter = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(column => (
                <th
                  key={column.field}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.field)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ↕
                        </button>
                      )}
                    </div>
                    {column.filterable && (
                      <Input
                        placeholder={`Filter ${column.header}`}
                        value={filters[column.field] || ''}
                        onChange={e => handleFilter(column.field, e.target.value)}
                        className="text-sm"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              >
                {columns.map(column => (
                  <td
                    key={column.field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[column.field]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of {data.length} entries
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
