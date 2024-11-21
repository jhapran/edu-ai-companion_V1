import React, { useState, useCallback, useEffect } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  initialValue?: string;
  showSearchButton?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
  initialValue = '',
  showSearchButton = false,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  // Trigger search when debounced term changes
  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-grow"
      />
      {showSearchButton && (
        <Button type="submit" className="whitespace-nowrap">
          Search
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
