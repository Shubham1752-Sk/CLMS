'use client';

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchGenres } from '@/actions/genreActions';

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
  setFilteredBooks: React.Dispatch<React.SetStateAction<{
    id: string;
    title: string;
    author: string;
    publisher: string | null;
    copies: number;
    genreId: string;
    isEbookAvailable: boolean;
    ebookUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[]>>;
}

interface Genre {
  id: string;
  name: string;
}

const BookFilter: React.FC<BookFilterProps> = ({ open, filters, setFilters, onFilterSearch, setFilteredBooks }) => {

  const [genres, setGenres] = React.useState<Genre[]>([]);
  const handleChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      author: '',
      publisher: '',
      minCopies: '',
      genreId: '',
      isEbookAvailable: '',
    });
    setFilteredBooks([]);
  };

  useEffect(() => {
    fetchGenres().then((genres) => {
      // console.log(genres)
      if (genres.length > 0) {
        setGenres(genres)
      }
    });
  }, [])

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

        <select
          value={filters.genreId}
          onChange={(e) => handleChange('genreId', e.target.value)}
          className="border border-gray-300 p-2 rounded-md shadow-sm w-full"
        >
          <option value="">All Genres</option>
          { genres.length > 0 && genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          value={filters.isEbookAvailable}
          onChange={(e) => handleChange('isEbookAvailable', e.target.value)}
          className="border border-gray-300 p-2 rounded-md shadow-sm w-full"
        >
          <option value="">Both</option>
          <option value="available">Available</option>
          <option value="issued">Not Available</option>
        </select>
      </div>

      {/* Search Button for Filters */}
      <div className='flex sm:flex-col gap-2'>
        <Button onClick={onFilterSearch} className="w-full sm:w-auto">
          Search
        </Button>
        <Button onClick={clearFilters} className="w-full sm:w-auto">
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default BookFilter;
