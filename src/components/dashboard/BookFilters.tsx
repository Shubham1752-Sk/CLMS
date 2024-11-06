// BookFilter.tsx

'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BookFilterProps {
  open: boolean;
  filters: {
    author: string;
    publisher: string;
    minCopies: string;
    genreId: string;
    isEbookAvailable: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    author: string;
    publisher: string;
    minCopies: string;
    genreId: string;
    isEbookAvailable: string;
  }>>;
  onFilterSearch: () => void; // Triggered by the "Search" button
}

const BookFilter: React.FC<BookFilterProps> = ({ open, filters, setFilters, onFilterSearch }) => {
  const handleChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  return (
    <div
      className={`transition-[max-height] duration-500 ease-linear overflow-hidden
        ${open ? 'max-sm:max-h-screen max-sm:w-full' : 'max-sm:max-h-0'} 
        sm:max-h-none sm:flex-col max-sm:mt-2 mx-auto sm:px-4`}
    >
      <h1 className="text-2xl font-bold mb-4 max-sm:hidden">Filter Books</h1>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 max-sm:grid-cols-2 gap-4 mb-4">
        <Input
          type="text"
          placeholder="Filter by author"
          value={filters.author}
          onChange={(e) => handleChange('author', e.target.value)}
          className="border border-gray-300 p-2 rounded-md shadow-sm"
        />

        <Input
          type="text"
          placeholder="Filter by publisher"
          value={filters.publisher}
          onChange={(e) => handleChange('publisher', e.target.value)}
          className="border border-gray-300 p-2 rounded-md shadow-sm"
        />

        <Input
          type="number"
          placeholder="Min copies available"
          value={filters.minCopies}
          onChange={(e) => handleChange('minCopies', e.target.value)}
          className="border border-gray-300 p-2 rounded-md shadow-sm"
        />

        <Select onValueChange={(value) => handleChange('genreId', value)} value={filters.genreId}>
          <SelectTrigger className="border border-gray-300 p-2 rounded-md shadow-sm w-full">
            <span>Select Genre</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Genres</SelectItem>
            <SelectItem value="1">Fiction</SelectItem>
            <SelectItem value="2">Non-Fiction</SelectItem>
            <SelectItem value="3">Science</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleChange('isEbookAvailable', value)} value={filters.isEbookAvailable}>
          <SelectTrigger className="border border-gray-300 p-2 rounded-md shadow-sm w-full">
            <span>E-book Availability</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Both</SelectItem>
            <SelectItem value="true">Available</SelectItem>
            <SelectItem value="false">Not Available</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Button for Filters */}
      <Button onClick={onFilterSearch} className="w-full sm:w-auto">
        Search
      </Button>
    </div>
  );
};

export default BookFilter;
