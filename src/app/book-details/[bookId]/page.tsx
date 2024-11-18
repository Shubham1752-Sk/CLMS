'use client';

import React, { useEffect, useState } from 'react';
import { getBookById } from '@/actions/bookActions';
import Loader from '@/components/common/Loader';
import Image from 'next/image';

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
  bookCopy: {
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
      try {
        const response = await getBookById(bookId);
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
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-700 font-semibold">Book not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-screen h-screen flex flex-col gap-5 mx-auto">
      <Image 
        src={`/images/header.png`}
        alt="book cover"
        width={200}
        height={300}
      />
      <div className="max-w-4xl mt-5 mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600">
            <strong>Author:</strong> {book.author}
          </p>
          {book.publisher && (
            <p className="text-lg text-gray-600">
              <strong>Publisher:</strong> {book.publisher}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Book Details</h2>
            <p className="text-gray-700">
              <strong>Total Copies:</strong> {book.copies}
            </p>
            <p className="text-gray-700">
              <strong>Available Copies:</strong> {book.availableCopies}
            </p>
            <p className="text-gray-700">
              <strong>E-Book Available:</strong> {book.isEbookAvailable ? 'Yes' : 'No'}
            </p>
            {book.isEbookAvailable && book.ebookUrl && (
              <p className="mt-2">
                <a
                  href={book.ebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  View E-Book
                </a>
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Copy Details</h2>
            <ul className="space-y-4">
              {book.bookCopy.map((copy) => (
                <li
                  key={copy.id}
                  className="p-4 border rounded-lg bg-gray-50 hover:shadow-lg transition-shadow"
                >
                  <p className="text-gray-700">
                    <strong>Condition:</strong> {copy.condition || 'Not specified'}
                  </p>
                  <p className="text-gray-700">
                    <strong>Status:</strong>{' '}
                    {copy.status.charAt(0).toUpperCase() + copy.status.slice(1)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
