'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { searchBooksByName, getAllBookCopies, updateBook, updateBookCopy } from '@/actions/bookActions';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Book {
    id: string;
    title: string;
    author: string;
    publisher: string | null;
    copies: number;
    genreId: string;
}

interface BookCopy {
    id: string;
    condition: string;
    status: string;
}

const EditBook = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [bookCopies, setBookCopies] = useState<BookCopy[]>([]);
    const [openEditBookDialog, setOpenEditBookDialog] = useState(false);
    const [openEditBookCopyDialog, setOpenEditBookCopyDialog] = useState(false);
    const [editData, setEditData] = useState({ title: '', author: '', publisher: '' });
    const [selectedCopy, setSelectedCopy] = useState<BookCopy | null>(null);

    const { toast } = useToast();

    // Search for books by title
    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const result = await searchBooksByName(searchQuery);
            setBooks(result as Book[]);
            setBookCopies([])
        }
    };

    // Load book copies once a book is selected
    const loadBookCopies = async (bookId: string) => {
        const result = await getAllBookCopies(bookId);
        setBookCopies(result.data as BookCopy[]);
    };

    // Open edit modal for book or book copy
    const handleEdit = (book: Book) => {
        setEditData({ title: book.title, author: book.author, publisher: book.publisher || '' });
        setSelectedBook(book);
        setOpenEditBookDialog(true);
    };

    const handleEditCopy = (copy: BookCopy) => {
        setSelectedCopy(copy);
        setOpenEditBookCopyDialog(true);
    };

    // Submit updated book data
    const handleSaveBook = async () => {
        if (selectedBook) {
            try {
                const res = await updateBook(selectedBook.id, editData);

                if (res.success) {
                    // Update the books state with the edited book data
                    setBooks((prevBooks) =>
                        prevBooks.map((book) =>
                            book.id === selectedBook.id ? { ...book, ...editData } : book
                        )
                    );

                    // Close the dialog and show success toast
                    setOpenEditBookDialog(false);
                    toast({
                        description: 'Book updated successfully',
                        variant: 'success',
                    });
                }
            } catch (error: any) {
                toast({
                    description: error.message || 'An error occurred while updating the book',
                    variant: 'destructive',
                });
            } finally {
                setOpenEditBookDialog(false);
            }
        }
    };

    // Submit updated book copy data
    const handleSaveCopy = async () => {
        if (selectedCopy) {
            try {
                const res = await updateBookCopy(selectedCopy.id, {
                    condition: selectedCopy.condition,
                    status: selectedCopy.status,
                });

                if (res.success) {
                    // Update the bookCopies state with the edited book copy data
                    setBookCopies((prevCopies) =>
                        prevCopies.map((copy) =>
                            copy.id === selectedCopy.id
                                ? { ...copy, condition: selectedCopy.condition, status: selectedCopy.status }
                                : copy
                        )
                    );

                    // Show success toast and close dialog
                    toast({
                        description: 'Book Copy updated successfully',
                        variant: 'success',
                    });
                    setOpenEditBookCopyDialog(false);
                }
            } catch (error: any) {
                toast({
                    description: error.message || 'An error occurred while updating the book copy',
                    variant: 'destructive',
                });
            } finally {
                setOpenEditBookCopyDialog(false);}
        }
    };


    return (
        <div className="p-4 w-full max-h-fit overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Book</h1>

            {/* Search for a book */}
            <div className='w-full flex max-sm:flex-col gap-2 justify-center'>
                <Input
                    type="text"
                    placeholder="Search by book title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-4 w-full"
                />
                <Button onClick={handleSearch}>Search</Button>
            </div>

            {/* Display books matching the search */}
            <div className="w-full mt-4 max-h-[80%] overflow-y-auto">
                {books.map((book) => (
                    <div key={book.id} className="mb-2 ">
                        <p>
                            <strong>{book.title}</strong> by {book.author}
                        </p>
                        <div key={book.id} className="mb-2 flex gap-4">
                            <Button onClick={() => handleEdit(book)}>Edit Book</Button>
                            <Button onClick={() => loadBookCopies(book.id)}>View Copies</Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Display book copies if a book is selected */}
            <div className="w-full mt-4 overflow-y-auto">

                <div className="mt-4 flex flex-col gap-4">
                    {bookCopies.length > 0 && bookCopies.map((copy) => (
                        <div key={copy.id} className="border rounded-lg p-4 shadow-md">
                            <p><strong>Copy ID:</strong> {copy.id}</p>
                            <p><strong>Condition:</strong> {copy.condition}</p>
                            <p><strong>Status:</strong> {copy.status}</p>
                            <Button onClick={() => handleEditCopy(copy)} className="mt-2">
                                Edit Copy
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit dialog for Book */}
            {openEditBookDialog && selectedBook && (
                <Dialog open={openEditBookDialog} onOpenChange={setOpenEditBookDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Book Details</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4 flex flex-col gap-4">
                            <div className='flex flex-col gap-2'>
                                <Label>Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Title"
                                    value={editData.title}
                                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>Author</Label>
                                <Input
                                    type="text"
                                    placeholder="Author"
                                    value={editData.author}
                                    onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                                />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <Label>Publisher</Label>
                                <Input
                                    type="text"
                                    placeholder="Publisher"
                                    value={editData.publisher}
                                    onChange={(e) => setEditData({ ...editData, publisher: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleSaveBook}>Save Book</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit dialog for Book Copy */}
            {openEditBookCopyDialog && selectedCopy && (
                <Dialog open={openEditBookCopyDialog} onOpenChange={setOpenEditBookCopyDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Book Copy</DialogTitle>
                        </DialogHeader>
                        <div className="mb-4 flex flex-col gap-4">
                            <div className='flex flex-col gap-2'>
                                <Label>Condition</Label>
                                <select
                                    className='w-full p-2 border border-gray-300 rounded-md'
                                    value={selectedCopy.condition}
                                    onChange={(e) => setSelectedCopy({ ...selectedCopy, condition: e.target.value })}
                                >
                                    <option value="new">New</option>
                                    <option value="damaged">Damaged</option>
                                </select>
                                
                            </div>

                            <div className='flex flex-col gap-2'>
                                <Label>Status</Label>
                                <select
                                    className='w-full p-2 border border-gray-300 rounded-md'
                                    value={selectedCopy.status}
                                    onChange={(e) => setSelectedCopy({ ...selectedCopy, status: e.target.value })}
                                >
                                    <option value="available">Available</option>
                                    <option value="issued">Issued</option>
                                </select>
                                
                            </div>

                            <Button onClick={handleSaveCopy}>Save Copy</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default EditBook;