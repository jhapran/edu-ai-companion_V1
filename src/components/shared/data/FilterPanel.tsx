import React, { useState } from 'react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Button from '../../ui/Button';

interface FilterField {
  field: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { label: string; value: any }[];
}

interface FilterPanelProps {
  fields: FilterField[];
  onApplyFilters: (filters: Record<string, any>) => void;
  onResetFilters: () => void;
  initialFilters?: Record<string, any>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  fields,
  onApplyFilters,
  onResetFilters,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({});
    onResetFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.field} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <Select
                value={filters[field.field] || ''}
                onChange={e => handleFilterChange(field.field, e.target.value)}
                className="w-full"
                options={[
                  { value: '', label: 'All' },
                  ...(field.options || [])
                ]}
              />
            ) : field.type === 'date' ? (
              <Input
                type="date"
                value={filters[field.field] || ''}
                onChange={e => handleFilterChange(field.field, e.target.value)}
                className="w-full"
              />
            ) : field.type === 'number' ? (
              <Input
                type="number"
                value={filters[field.field] || ''}
                onChange={e => handleFilterChange(field.field, e.target.value)}
                className="w-full"
              />
            ) : (
              <Input
                type="text"
                value={filters[field.field] || ''}
                onChange={e => handleFilterChange(field.field, e.target.value)}
                placeholder={`Filter by ${field.label.toLowerCase()}`}
                className="w-full"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-2">
        <Button onClick={handleApply} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={handleReset} variant="secondary" className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
