'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getBooksPaginated, searchBooksByName } from '@/actions/bookActions'; // Replace with actual path
import { FilterIcon } from 'lucide-react';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import BookFilter from '@/components/dashboard/BookFilters';

interface Book {
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
}

const PaginatedBookList = () => {
  const [books, setBooks] = useState<Book[]>([]); // Stores books for pagination or search results
  // const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [page, setPage] = useState<number>(1); // Current page for pagination
  const [limit] = useState(10); // Books per page for pagination
  const [totalBooks, setTotalBooks] = useState<number>(0); // Total books count
  const [searchQuery, setSearchQuery] = useState<string>(''); // Stores the search query
  const [searchResults, setSearchResults] = useState<Book[]>([]); // Stores search results

  // filter states
  const [filters, setFilters] = useState({
    author: '',
    publisher: '',
    minCopies: '',
    genreId: '',
    isEbookAvailable: '',
  });
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [openFilterDialog, setOpenFilterDialog] = useState<boolean>(false);

  const totalPages = Math.ceil(totalBooks / limit); // Total pages based on pagination limit
  const debouncedBookSearchQuery = useDebounce(searchQuery, 1000);

  const { toast } = useToast();
  const router = useRouter();

  // Fetch paginated books
  useEffect(() => {
    const loadBooks = async () => {
      const { books, totalBooks } = await getBooksPaginated(page, limit);
      setBooks(books as Book[]);
      setTotalBooks(totalBooks as number);
    };

    // Load books if no search query is present
    if (!searchQuery) {
      loadBooks();
    }
  }, [page, limit]);

  useEffect(() => {
    if (debouncedBookSearchQuery) {
      searchBooksByName(debouncedBookSearchQuery)
        .then((results) => {
          setSearchResults(results as Book[]);
        })
        .catch((error) => toast({
          description: `Error fetching books ${error}`,
          value: 'destructive',
        }));
    } else {
      setSearchResults([]); // Clear search results when the search query is empty
    }
  }, [debouncedBookSearchQuery]);

  // Handle filter search when "Search" button is clicked in `BookFilter`
  const handleFilterSearch = async () => {
    try {
      const filteredBooks = await getFilteredBooks(filters); // Run the server action
      setDisplayedBooks(filteredBooks as Book[]);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  // Page navigation handlers
  const handleNextPage = () => setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  // Decide whether to display paginated books or search results
  const displayedBooks = books;

  return (
    <div className="container w-full h-screen overflow-hidden flex gap-4 p-4 py-8">
      {/* filters */}
      <div className='w-2/12 h-full max-sm:hidden'>
        <BookFilter open={openFilterDialog} filters={filters} setFilters={setFilters} onFilterSearch={handleFilterSearch} />
      </div>

      {/* books */}
      <div className='w-full h-full'>
        <h1 className="text-2xl font-bold text-center mb-4">Book List</h1>

        {/* Search Bar */}
        <div className="z-10 sticky w-full mx-auto flex flex-col items-center mb-6">
          <div className='w-full mx-auto flex justify-center gap-4 max-sm:px-2'>
            <Input
              type="text"
              placeholder="Search books by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-1/2 border-2 border-gray-800 p-2 rounded-md shadow-sm"
            />
            <div className='max-sm:block hidden'>
              <button
                className='w-10 h-9 bg-blue-600 rounded-sm text-center items-center text-white '
                onClick={() => { setOpenFilterDialog((prev) => !prev) }}
              >
                {
                  openFilterDialog ? <Cross1Icon className='w-full' /> : <FilterIcon className='w-full' />
                }
              </button>
            </div>
          </div>
          {
            searchQuery !== "" && searchResults.length > 0 && (
              <div className="w-full absolute mt-10 bg sm:w-1/2 max-h-40 overflow-y-auto text-gray-600 border border-gray-300 rounded-lg p-2 bg-white shadow-md">
                <p className="mb-2">Showing {searchResults.length} results for "{searchQuery}"</p>
                <ul className="space-y-1">
                  {searchResults.map((book) => (
                    <li
                      key={book.id}
                      className="hover:bg-gray-200 cursor-pointer p-1 rounded"
                      onClick={() => router.push(`/book-details/${book.id}`)}
                    >
                      {book.title}
                    </li>
                  ))}
                </ul>
              </div>
            )
          }
        </div>

        {/* book cards */}
        <div className='w-full h-[80%] mx-auto flex flex-col items-center overflow-y-auto max-sm:-mt-4 sm:mt-2 pb-4'>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {displayedBooks.map((book) => (
              <div
                key={book.id}
                className="w-[300px] h-[150px] bg-white shadow-md rounded-lg p-4 flex flex-col transition duration-75 ease-in-out hover:cursor-pointer hover:bg-[#d5d0d0] hover:scale-105"
                onClick={() => router.push(`/book-details/${book.id}`)}
              >
                <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-1"><strong>Author:</strong> {book.author}</p>
              </div>
            ))}
            {
              (displayedBooks.length === 0) && (<p>No books found.</p>)
            }
          </div>
        </div>

        {/* pagignation buttons */}
        <div className="flex justify-center items-center space-x-4 max-sm:mt-2">
          <Button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaginatedBookList;
