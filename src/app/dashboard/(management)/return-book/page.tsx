'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Import from your UI library
import { getPaginatedBookIssues, returnBookById } from '@/actions/bookActions'; // Actions to fetch issues and return book
import { useToast } from '@/hooks/use-toast';

interface BookIssue {
  id: string;
  bookCopyId: string;
  libraryCardId: string;
  issueDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: string;
}

const ReturnBook = () => {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<BookIssue[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalIssues, setTotalIssues] = useState<number>(0);

  // For handling return dialog
  const [selectedIssue, setSelectedIssue] = useState<BookIssue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fine, setFine] = useState<number>(0);

  const { toast } = useToast();

  // Fetch paginated book issues on component mount or when page changes
  useEffect(() => {
    async function fetchBookIssues() {
      const { issues, totalCount } = await getPaginatedBookIssues(page, limit);
      setBookIssues(issues);
      setTotalIssues(totalCount);
      setFilteredIssues(issues);
    }
    fetchBookIssues();
  }, [page]);

  const calculateFine = (dueDate: Date) => {
    const today = new Date();
    const daysOverdue = Math.ceil((today.getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24));
    // console.log('daysOverdue:', daysOverdue);
    return daysOverdue > 0 ? daysOverdue : 0;
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredIssues(bookIssues);
    } else {
      setFilteredIssues(
        bookIssues.filter((issue) =>
          issue.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const openReturnDialog = (issue: BookIssue) => {
    const fineAmount = calculateFine(issue.dueDate);
    setSelectedIssue(issue);
    setFine(fineAmount);
    setIsDialogOpen(true);
  };

  const handleReturnBook = async () => {
    if (!selectedIssue) return;
    const response = await returnBookById(selectedIssue.id);

    if (response.success) {
        toast({
            description: response.message,
            variant: 'success',
        })
      setFilteredIssues((prev) => prev.filter((issue) => issue.id !== selectedIssue.id));
      setIsDialogOpen(false); // Close the dialog after returning the book
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Return Issued Books</h1>

      {/* Search and Filter */}
      <div className="mb-4 flex max-sm:flex-col gap-2 justify-center ">
        <Input
          type="text"
          placeholder="Search by Issue ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-gray-800 p-2 rounded-md shadow-sm w-full sm:w-1/2 mb-2"
        />
        <Button onClick={handleSearch} className="max-sm:w-full ">
          Search
        </Button>
      </div>

      {/* Book Issue List */}
      <div className="w-full overflow-y-auto">
        {filteredIssues.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Issue ID</th>
                <th className="px-4 py-2 border-b">Book Copy ID</th>
                <th className="px-4 py-2 border-b">Library Card ID</th>
                <th className="px-4 py-2 border-b">Issue Date</th>
                <th className="px-4 py-2 border-b">Due Date</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="border-b">
                  <td className="px-4 py-2">{issue.id}</td>
                  <td className="px-4 py-2">{issue.bookCopyId}</td>
                  <td className="px-4 py-2">{issue.libraryCardId}</td>
                  <td className="px-4 py-2">{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{new Date(issue.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <Button onClick={() => openReturnDialog(issue)}>
                      Return Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No book issues found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </Button>
        <span className="text-gray-600">
          Page {page} of {Math.ceil(totalIssues / limit)}
        </span>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, Math.ceil(totalIssues / limit)))}
          disabled={page === Math.ceil(totalIssues / limit)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </Button>
      </div>

      {/* Return Dialog */}
      {isDialogOpen && selectedIssue && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Return Book</DialogTitle>
            </DialogHeader>
            <div>
              <p><strong>Issue ID:</strong> {selectedIssue.id}</p>
              <p><strong>Book Copy ID:</strong> {selectedIssue.bookCopyId}</p>
              <p><strong>Library Card ID:</strong> {selectedIssue.libraryCardId}</p>
              <p><strong>Issue Date:</strong> {new Date(selectedIssue.issueDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(selectedIssue.dueDate).toLocaleDateString()}</p>
              <p><strong>Fine (if any):</strong> Rs. {fine}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleReturnBook} variant="default">
                Confirm Return
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ReturnBook;
