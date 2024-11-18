'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you have a select component
import { useToast } from '@/hooks/use-toast';
import { addBook } from '@/actions/bookActions'; // Assuming these server actions exist
import { fetchGenres } from '@/actions/genreActions'; // Assuming these server actions exist

interface Genre {
  name: string;
  id: string;
}

const AddBookComponent = () => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const [copies, setCopies] = useState<number>(1);
  const [genreId, setGenreId] = useState<string>('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isEbookAvailable, setIsEbookAvailable] = useState<boolean>(false);
  const [ebookUrl, setEbookUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch genres on component mount
  useEffect(() => {
    async function fetchGenreList() {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    }
    fetchGenreList();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!title || !author || !genreId) {
      setError('Title, author, Genre are required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedGenreId = genres.find(genre => genre.name === genreId)?.id; // Find the ID based on the selected name
      // console.log(selectedGenreId)

      const response = await addBook({
        title,
        author,
        // isbn,
        publisher,
        // publishedAt: publishedAt ? new Date(publishedAt) : null,
        copies,
        genreId: selectedGenreId as string,
        isEbookAvailable,
        ebookUrl: isEbookAvailable ? ebookUrl : null,
      });

      if (response.success) {
        toast({ description: 'Book added successfully!', variant: 'success' });
        // Clear the form
        setTitle('');
        setAuthor('');
        // setIsbn('');
        setPublisher('');
        // setPublishedAt('');
        setCopies(1);
        setGenreId('');
        setIsEbookAvailable(false);
        setEbookUrl('');
      } else {
        throw new Error('Failed to add the book.');
      }
    } catch (err) {
      setError('An error occurred while adding the book. Please try again.');
      toast({ description: 'An error occurred while adding the book. Please try again.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author name"
            className="mt-1"
            required
          />
        </div>
        {/* <div>
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="Enter book ISBN"
            className="mt-1"
            required
          />
        </div> */}
        <div>
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            placeholder="Enter publisher"
            className="mt-1"
          />
        </div>
        {/* <div>
          <Label htmlFor="publishedAt">Published Date</Label>
          <Input
            id="publishedAt"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            type="date"
          />
        </div> */}
        <div>
          <Label htmlFor="copies">Number of Copies</Label>
          <Input
            id="copies"
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
            type="number"
            min="1"
            className="mt-1"
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label htmlFor="genre">Genre</Label>
          
          <select
            name="genre"
            id="genre"
            className="border p-2"
            value={genreId} // Bind the value to state
            required={true}
            onChange={(e) => {
              setGenreId(e.target.value as string); // Set the selected genre ID
            }}
          >
            <option>Select a Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="isEbookAvailable">Is E-book Available?</Label>
          <Input
            id="isEbookAvailable"
            type="checkbox"
            checked={isEbookAvailable}
            onChange={() => setIsEbookAvailable(!isEbookAvailable)}
            className="mt-1"
          />
        </div>

        {isEbookAvailable && (
          <div>
            <Label htmlFor="ebookUrl">E-book URL</Label>
            <Input
              id="ebookUrl"
              value={ebookUrl}
              onChange={(e) => setEbookUrl(e.target.value)}
              placeholder="Enter E-book URL"
              className="mt-1"
            />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Book'}
        </Button>
      </form>
    </div>
  );
};

export default AddBookComponent;
