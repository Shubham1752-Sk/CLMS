'use client';

import React, { useEffect, useState } from 'react';
import { getBookById } from '@/actions/bookActions';

interface BookDetailProps {
  params: {
    bookId: string;
  };
}

interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  copies: number;
  availableCopies: number;
  isEbookAvailable: boolean;
  ebookUrl?: string;
  BookCopy: {
    id: string;
    condition?: string;
    status: string; // available, issued, damaged
  }[];
}

const BookDetail: React.FC<BookDetailProps> = ({ params }) => {
  const { bookId } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      console.log(bookId)
      try {
        const response = await getBookById(bookId);
        console.log(response.data)
        if (response.success) {
          setBook(response.data as Book);
        } else {
          setError(response.error as string);
        }
      } catch (err) {
        setError('Failed to fetch book details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div className="p-6 w-screen h-screen mx-auto border rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      {book.publisher && (
        <p>
          <strong>Publisher:</strong> {book.publisher}
        </p>
      )}
      <p>
        <strong>Total Copies:</strong> {book.copies}
      </p>
      <p>
        <strong>Available Copies:</strong> {book.availableCopies}
      </p>
      <p>
        <strong>E-Book Available:</strong> {book.isEbookAvailable ? 'Yes' : 'No'}
      </p>
      {book.isEbookAvailable && book.ebookUrl && (
        <p>
          <a href={book.ebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            View E-Book
          </a>
        </p>
      )}
      <h3 className="text-xl font-semibold mt-4">Copy Details:</h3>
      <ul className="list-disc pl-5">
        {book.BookCopy.map((copy) => (
          <li key={copy.id} className="mb-2">
            <p>
              <strong>Condition:</strong> {copy.condition || 'Not specified'}
            </p>
            <p>
              <strong>Status:</strong> {copy.status.charAt(0).toUpperCase() + copy.status.slice(1)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookDetail;
