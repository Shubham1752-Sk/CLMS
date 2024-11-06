'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useDebounce } from '@/hooks/use-debounce';
import { fetchBookCopies, searchBooksByName, searchLibraryCards, issueBookToUser } from '@/actions/bookActions'; // Server actions for searching and fetching

interface Book{
    id: string;
    title: string;
    author: string;
    publisher?: string;
    genreId: string;
    copies: number;
    isEbookAvailable: boolean;
    ebookUrl?: string;
}

interface BookCopy{
    id: string;
    bookId: string;
    condition: string;
    status: string;
    libraryCardId: string;
}

interface User{
    id: string;
    name: string;
    email: string;
    // department: 
}

interface LibraryCard{
    cardId: string;
    studentId: string;
    studentName: string;
}

const IssueBookComponent = () => {
  const [bookQuery, setBookQuery] = useState<string>(''); // Book search input
  const [libraryCardQuery, setLibraryCardQuery] = useState(''); // Library card search input

  const [bookResults, setBookResults] = useState<Book[]>([]); // Store books returned by search  
  const [selectedBookId, setSelectedBookId] = useState(''); // Store selected book ID
  
  const [selectedBookCopyId, setSelectedBookCopyId] = useState('');
  const [bookCopies, setBookCopies] = useState<BookCopy[]>([]); // Store copies of the selected book
  
  const [libraryCards, setLibraryCards] = useState<LibraryCard[]>([]); // Store library cards
  const [selectedLibraryCardId, setSelectedLibraryCardId] = useState(''); // Store selected library card

  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10)); // Set default date to today
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const debouncedBookSearchQuery = useDebounce(bookQuery, 1000);
  const debouncedLibraryCardQuery = useDebounce(libraryCardQuery, 1000);

  // Fetch books based on the debounced search query
  useEffect(() => {
    if (debouncedBookSearchQuery) {
        searchBooksByName(debouncedBookSearchQuery)
        .then((data) => setBookResults(data as Book[]))
        .catch((error) => console.error('Error fetching books:', error));
    } else {
        setBookResults([]); // Clear books if no query
    }
  }, [debouncedBookSearchQuery]);


  // Fetch book copies when a book is selected
  useEffect(() => {
    if (selectedBookId) {
      fetchBookCopies(selectedBookId)
        .then((copies) => setBookCopies(copies as BookCopy[]))
        .catch((error) => console.error('Error fetching book copies:', error));
    }
  }, [selectedBookId]);

  // Fetch Library Cards on the debounced search query
  useEffect(() => {
    if (debouncedLibraryCardQuery) {
      console.log('fetching library cards');
        searchLibraryCards(debouncedLibraryCardQuery)
          .then((data) => {setLibraryCards(data as LibraryCard[]); console.log(data)})
          .catch((error) => console.error('Error fetching Library Cards:', error));
    } 
    // else {
    //     setBookResults([]); // Clear books if no query
    // }
  }, [debouncedLibraryCardQuery]);

  // Handle form submission (issuing the book)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBookCopyId || !selectedLibraryCardId) {
      toast({
        description: 'Please select a book and a library card.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await issueBookToUser({
        bookCopyId: selectedBookCopyId,
        libraryCardId: selectedLibraryCardId,
        issueDate: new Date(issueDate),
      });

      if (response.success) {
        toast({ description: 'Book issued successfully!', variant: 'success' });
        setSelectedBookId('');
        setSelectedBookCopyId('');
        setSelectedLibraryCardId('');
        setIssueDate(new Date().toISOString().slice(0, 10)); // Reset the date to today
      } else {
        throw new Error(response.message || 'Failed to issue book.');
      }
    } catch (error) {
      console.log(error)
      toast({
        description: `${error}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Issue Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search Book by Name */}
        <div>
          <Label htmlFor="bookSearch">Search Book</Label>
          <Input
            id="bookSearch"
            value={bookQuery}
            onChange={(e) => setBookQuery(e.target.value)}
            placeholder="Search book by name"
            className="mt-1"
          />
          {/* Book Search Results */}
          {bookResults.length > 0 && (
            <select
              id="bookSelect"
              className="border p-2 mt-2 w-full"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
            >
              <option value="">Select a Book</option>
              {bookResults.map((book) => (
                <option key={book.id} value={book.id} className='w-full flex bg-gray-700 justify-between'>
                  <p className=''>{book.title}</p> 
                  <p className='text-gray-500'>{book.author}</p>
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Display Book Copies */}
        {bookCopies.length > 0 && (
          <div>
            <Label htmlFor="bookCopy">Select Book Copy</Label>
            <select
              id="bookCopy"
              className="border p-2 mt-2 w-full"
              value={selectedBookCopyId}
              onChange={(e) => setSelectedBookCopyId(e.target.value)}
            >
              <option value="">Select a Book Copy</option>
              {bookCopies.map((copy) => (
                <option
                  key={copy.id}
                  value={copy.id}
                  disabled={copy.status !== 'available'}
                  className={copy.status === 'available' ? 'text-green-600' : 'text-red-600'}
                >
                  Book Id {copy.id} - {copy.condition} ({copy.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Library Card */}
        <div>
          <Label htmlFor="libraryCardSearch">Search Library Card</Label>
          <Input
            id="libraryCardSearch"
            value={libraryCardQuery}
            onChange={(e) => setLibraryCardQuery(e.target.value)}
            placeholder="Search library card by student name"
            className="mt-1"
          />
          {/* Library Card Results */}
          {
            debouncedLibraryCardQuery !== '' && libraryCards.length === 0 && (
              <p className='text-red-400'>No library card Found with the given card No. </p>
            )  
          }
          {libraryCards.length > 0 && (
            <select
              id="libraryCardSelect"
              className="border p-2 mt-2 w-full"
              value={selectedLibraryCardId}
              onChange={(e) => setSelectedLibraryCardId(e.target.value)}
            >
              <option value="">Select a Library Card</option>
              {libraryCards.map((card) => (
                <option key={card.cardId} value={card.cardId}>
                  {card.studentName} (Card ID: {card.cardId})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Issue Date */}
        <div>
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Issuing...' : 'Issue Book'}
        </Button>
      </form>
    </div>
  );
};

export default IssueBookComponent;