'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addGenre, fetchGenres, updateGenre } from '@/actions/genreActions'; // Assuming server actions exist

interface Genre {
    name: string;
    id: string;
}

const AddGenreComponent = () => {
    const [genreName, setGenreName] = useState<string>('');
    const [genres, setGenres] = useState<Genre[] >([]); // Store fetched genres
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingGenreId, setEditingGenreId] = useState<string>('');
    const [editingGenreName, setEditingGenreName] = useState<string>(''); // Store the genre name being edited

    const { toast } = useToast();

    // Fetch genres on component mount
    useEffect(() => {
        async function fetchAllGenres() {
            try {
                const genreList = await fetchGenres();
                setGenres(genreList);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        }
        fetchAllGenres();
    }, []);

    // Handle form submission to add a new genre
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!genreName.trim()) {
            setError('Genre name is required.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await addGenre(genreName);

            if (response.success) {
                toast({ description: 'Genre added successfully!', variant: 'success' });
                setGenres([...genres, response.genre] as Genre[]); // Add new genre to the list
                setGenreName(''); // Clear form
            } else {
                throw new Error(response.message || 'Failed to add genre.');
            }
        } catch (err) {
            setError('An error occurred while adding the genre. Please try again.');
            toast({ description: 'An error occurred while adding the genre. Please try again.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Start editing a genre
    const handleEdit = (genreId: string, currentName: string) => {
        setEditingGenreId(genreId);
        setEditingGenreName(currentName);
    };

    // Handle genre update
    const handleUpdateGenre = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGenreName.trim()) {
            setError('Genre name cannot be empty.');
            return;
        }

        try {
            const response = await updateGenre(editingGenreId, editingGenreName);
            if (response.success) {
                toast({ description: 'Genre updated successfully!', variant: 'success' });
                // Update the genre in the list
                setGenres(genres.map((genre) => (genre.id === editingGenreId ? { ...genre, name: editingGenreName } : genre)));
                setEditingGenreId('');
                setEditingGenreName('');
            } else {
                throw new Error(response.message || 'Failed to update genre.');
            }
        } catch (err) {
            setError('An error occurred while updating the genre. Please try again.');
            toast({ description: 'An error occurred while updating the genre. Please try again.', variant: 'destructive' });
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-4">Add New Genre</h1>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="genreName" className='text-xl font-bold'>Genre Name</Label>
                    <Input
                        id="genreName"
                        value={genreName}
                        onChange={(e) => setGenreName(e.target.value)}
                        placeholder="Enter genre name"
                        className="mt-1"
                        required
                    />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Genre'}
                </Button>
            </form>

            {/* Genre List */}
            <h2 className="text-xl font-bold mt-8">Existing Genres</h2>
            {
                genres.length === 0 ? (
                    <p className="text-center text-gray-500">No Existing genres found.</p>
                ) : (
                    <table className="min-w-full bg-white mt-4 border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-r border-b text-start">Genre Name</th>
                                <th className="px-4 py-2 border-r border-b text-start">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {genres.map((genre) => (
                                <tr key={genre.id} className="border-b">
                                    <td className="px-4 py-2 border-r">
                                        {editingGenreId === genre.id ? (
                                            <Input
                                                value={editingGenreName}
                                                onChange={(e) => setEditingGenreName(e.target.value)}
                                                placeholder="Enter new genre name"
                                                className="mt-1"
                                            />
                                        ) : (
                                            genre.name
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingGenreId === genre.id ? (
                                            <Button onClick={handleUpdateGenre} className="mr-2">
                                                Save
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleEdit(genre.id, genre.name)} className="mr-2">
                                                Edit
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    );
};

export default AddGenreComponent;
