"use server";

import { db } from "@/db";
import { calculateDueDate, calculateDifferenceInDays } from "../utils/helper";


export async function addBook(data: {
  title: string;
  author: string;
  // isbn: string;
  publisher?: string;
  // publishedAt?: Date | null;
  copies: number; // Number of physical copies
  genreId: string;
  isEbookAvailable: boolean;
  ebookUrl?: string | null;
}) {
  try {
    // Step 1: Create the Book entry
    const newBook = await db.book.create({
      data: {
        title: data.title,
        author: data.author,
        // isbn: data.isbn,
        publisher: data.publisher,
        // publishedAt: data.publishedAt,
        copies: data.copies,
        genreId: data.genreId,
        isEbookAvailable: data.isEbookAvailable,
        ebookUrl: data.isEbookAvailable ? data.ebookUrl : null,
      },
    });

    // Step 2: Create the BookCopies (based on the number of copies)
    const bookCopies = [];
    for (let i = 0; i < data.copies; i++) {
      const bookCopy = await db.bookCopy.create({
        data: {
          bookId: newBook.id, // Reference the newly created book
          condition: "new", // Set the default condition for each copy
          status: "available", // Set the initial status
        },
      });
      bookCopies.push(bookCopy);
    }

    return { success: true, book: newBook, bookCopies };
  } catch (error) {
    console.error("Error adding book and book copies:", error);
    return { success: false, message: "Failed to add book and book copies." };
  }
}

export async function fetchAvailableBooks() {
  try {
    const books = await db.bookCopy.findMany({
      where: {
        status: "available",
      },
      include: {
        book: true, // Include book details
      },
    });

    return books.map((bookCopy) => ({
      id: bookCopy.id,
      copyId: bookCopy.id,
      title: bookCopy.book.title,
      condition: bookCopy.condition,
      status: bookCopy.status,
    }));
  } catch (error: any) {
    console.error("Error fetching available books:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch available books",
    };
  }
}

export async function searchBooksByName(query: string) {
  try {
    const books = await db.book.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
    return books;
  } catch (error: any) {
    console.error("Error searching books:", error);
    return {
      success: false,
      message: error.message || "Failed to search the book by Title",
    };
  }
}

export async function fetchBookCopies(bookId: string) {
  try {
    const copies = await db.bookCopy.findMany({
      where: { bookId },
    });
    return copies;
  } catch (error: any) {
    console.error("Error fetching book copies:", error);
    return {
      success: false,
      message: error.message || "Failed to find the Book Copies",
    };
  }
}

export async function searchLibraryCards(query: string) {
  console.log(query);
  try {
    // Step 1: Find users with names that contain the search query
    const users = await db.user.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive', // case-insensitive search
        },
      },
      select: {
        id: true,       // Only get the user ID
        name: true,     // Get the user name for display
      },
    });

    // Extract the IDs of users that matched the search query
    const userIds = users.map((user) => user.id);

    // Step 2: Find library cards associated with these users
    const libraryCards = await db.libraryCard.findMany({
      where: {
        studentId: {
          in: userIds, // Filter by user IDs obtained in step 1
        },
      },
      include: {
        user: {
          select: {
            name: true, // Include user name in the result
          },
        },
      },
    });

    // console.log(libraryCards)

    // Step 3: Map the result to include relevant information
    return libraryCards.map((card) => ({
      cardId: card.id,             // Library card ID
      studentId: card.studentId,   // Student ID associated with the library card
      studentName: card.user?.name // Student name
    }));
  } catch (error: any) {
    console.error("Error searching library cards:", error);
    return {
      success: false,
      message: error.message || "Failed to search Library Cards",
    };
  }
}

// Server action to issue a book to a user
export async function issueBookToUser({
  bookCopyId,
  libraryCardId,
  issueDate = new Date(), // Optional, defaults to now
}: {
  bookCopyId: string;
  libraryCardId: string;
  issueDate?: Date;
}) {
  try {
    // Check how many books are already issued to this library card
    const libraryCard = await db.libraryCard.findUnique({
      where: { id: libraryCardId },
      include: {
        issuedBooks: true, // Fetch all issued books
      },
    });

    if (!libraryCard) {
      throw new Error("Library card not found");
    }

    // Check if the user has reached their issue limit
    if (libraryCard.issuedBooks.length >= libraryCard.issueLimit) {
      throw new Error("Issue limit reached for this library card");
    }

    // Fetch the book copy and ensure it is available
    const bookCopy = await db.bookCopy.findUnique({
      where: { id: bookCopyId },
    });

    // console.log('bookCopy is: ',bookCopy)

    if (!bookCopy || bookCopy.status !== "available") {
      throw new Error("Book copy is not available for issue");
    }

    // Calculate the due date (14 days after issue date)
    const dueDate = calculateDueDate();

    // console.log(dueDate);

    // return

    // Create the BookCopyIssue record to track this issue
    const newIssue = await db.bookCopyIssue.create({
      data: {
        bookCopyId,
        libraryCardId,
        issueDate,
        dueDate,
        status: "issued",
      },
    });

    // Update the BookCopy to reflect it has been issued
    await db.bookCopy.update({
      where: { id: bookCopyId },
      data: {
        status: "issued", // Change status to issued
        
        // libraryCardId: libraryCardId, // Link the book copy to the library card
      },
    });

    return {
      success: true,
      message: "Book issued successfully",
      newIssue,
    };
  } catch (error: any) {
    console.error("Error issuing book:", error);
    return {
      success: false,
      message: error.message || "Failed to issue the book",
    };
  }
}

export async function getBooksPaginated(page: number, limit: number) {
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Fetch paginated books and total count
    const [books, totalBooks] = await Promise.all([
      db.book.findMany({
        skip: offset,
        take: limit,
        orderBy: { title: "asc" }, // Order by title (optional)
      }),
      db.book.count(), // Get the total count of books
    ]);

    return {
      sucess: true,
      books,
      totalBooks,
    };
  } catch (error: any) {
    console.error("Error fetching paginated books:", error);
    return {
      success: false,
      message: error.message || "Failed to Fetch the books",
    };
  }
}

export async function getFilteredBooks(filters: {
  author?: string;
  publisher?: string;
  minCopies?: string;
  genreId?: string;
  isEbookAvailable?: string;
}) {
  // console.log(filters)
  const { author, publisher, minCopies, genreId, isEbookAvailable } = filters;

  try {
    const books = await db.book.findMany({
      where: {
        ...(author && { author: { contains: author, mode: "insensitive" } }),
        ...(publisher && {
          publisher: { contains: publisher, mode: "insensitive" },
        }),
        ...(minCopies && { copies: { gte: parseInt(minCopies) } }),
        ...(genreId && { genreId }),
        ...(isEbookAvailable && {
          isEbookAvailable: isEbookAvailable === "true",
        }),
      },
      orderBy: { title: "asc" },
    });

    console.log(books)

    if(books.length === 0){
      return {
        success: false, 
        message: 'No books found.'
      }
    }

    return {
      success: true, 
      books
    };
  } catch (error) {
    console.error("Error fetching filtered books:", error);
    throw new Error("Failed to fetch filtered books");
  }
}

export async function getBookById(bookId: string) {
  try {
    const book = await db.book.findUnique({
      where: { id: bookId },
      include: {
        bookCopy: true, // Include copies to get details of each physical copy
        genres: true, // Include genres if needed
      },
    });

    if (!book)
      return {
        success: false,
        message: "Book not Found",
      };
    // Calculate availability based on `copies` relation (assuming it contains availability info)
    const availableCopies = book.bookCopy.filter(
      (copy) => copy.status === "available"
    ).length;

    return {
      success: true,
      data: {
        ...book,
        availableCopies,
      },
    };
  } catch (error) {
    console.error("Error fetching book details:", error);
    return { success: false, error: "Failed to fetch book details" };
  }
}

export async function getPaginatedBookIssues(page: number, limit: number) {
  const issues = await db.bookCopyIssue.findMany({
    where: { status: 'issued' },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { issueDate: 'desc' },
    include: { bookCopy: true, libraryCard: true },
  });

  const totalCount = await db.bookCopyIssue.count();

  return {
    issues,
    totalCount,
  };
}

export async function returnBookById(issueId: string) {
  try {
    const bookIssue = await db.bookCopyIssue.findUnique({
      where: { id: issueId },
    });
    // console.log('bookIssue:', bookIssue);

    if (!bookIssue) {
      return { success: false, message: 'Issue not found.' };
    }

    const returnDate = new Date();

    const overdueDays = calculateDifferenceInDays(bookIssue.dueDate);
    console.log('overdueDays:', overdueDays);
    // return

    let fine = 0;
    if (overdueDays > 0) {
      fine = overdueDays * 1; // Fine of Rs. 1 per overdue day
    }

    await db.fine.create({
      data: {
        amount: fine,
        libraryCardId: bookIssue.libraryCardId,
      },
    });

    await db.bookCopyIssue.update({
      where: { id: issueId },
      data: {
        returnDate,
        status: fine === 0 ? 'returned' : 'overdue',
        updatedAt: new Date(),
      },
    });

    await db.bookCopy.update({
      where: { id: bookIssue.bookCopyId },
      data: { status: 'available' },
    });

    return {
      success: true,
      message: `Book returned successfully${fine > 0 ? ` with a fine of Rs. ${fine}` : ''}.`,
    };
  } catch (error) {
    console.error('Error returning book:', error);
    return { success: false, message: 'Failed to return book.' };
  }
}

export async function getAllBookCopies(bookId: string) {
  if (!bookId) {
    return {
      success: false,
      message: 'Book ID is required.',
    };
  }

  try {
    const bookCopies = await db.bookCopy.findMany({
      where: { bookId },
    });

    if (!bookCopies.length) {
      return {
        success: true,
        message: 'No copies found for this book.',
        data: [],
      };
    }

    return {
      success: true,
      message: `${bookCopies.length} book copies found.`,
      data: bookCopies,
    };
  } catch (error) {
    console.error('Error fetching book copies:', error);
    return {
      success: false,
      message: 'Failed to fetch book copies.',
    };
  }
}

export async function updateBook(bookId: string, updatedData: Partial<{ title: string; author: string; publisher: string }>) {
  // console.log(updatedData)
  if (!bookId || !updatedData) {
    return {
      success: false,
      message: 'Book ID and update data are required.',
    };
  }

  try {
    const book = await db.book.update({
      where: { id: bookId },
      data: updatedData,
    });

    return {
      success: true,
      message: 'Book updated successfully.',
      data: book,
    };
  } catch (error) {
    console.error('Error updating book:', error);
    return {
      success: false,
      message: 'Failed to update book details.',
    };
  }
}

export async function updateBookCopy(bookCopyId: string, updatedData: Partial<{ condition: string; status: string }>) {
  if (!bookCopyId || !updatedData) {
    return {
      success: false,
      message: 'Book copy ID and update data are required.',
    };
  }

  try {
    const bookCopy = await db.bookCopy.update({
      where: { id: bookCopyId },
      data: updatedData,
    });

    return {
      success: true,
      message: 'Book copy updated successfully.',
      data: bookCopy,
    };
  } catch (error) {
    console.error('Error updating book copy:', error);
    return {
      success: false,
      message: 'Failed to update book copy details.',
    };
  }
}