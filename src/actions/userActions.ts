"use server"

import { db } from "@/db";
import { saltAndHashPassword } from "@/utils/helper";

interface UpdateUserProfileInput {
  userId: string;
  name?: string;
  email?: string;
  departmentId?: string;
  batchId?: string;
  image?: string;
}


export const getUserByEmail = async (email: string) => {
  try {
    // console.log("in the func")
    const user = await db.user.findUnique({
      where: {
        email,
      }
    });
    // console.log(user)
    return user;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

export async function generateLibraryCard(studentId: string) {
  try {
    // console.log("in the gen func")
    // Check if the student already has a library card
    let libraryCard = await db.libraryCard.findUnique({
      where: {
        studentId: studentId,
      },
      include: {
        issuedBooks: true, // Include issued books in the response
      },
    });

    // If the student does not have a library card, create one
    if (!libraryCard) {
      libraryCard = await db.libraryCard.create({
        data: {
          studentId: studentId,
          //   cardNumber: generateCardNumber(), // Generate a new card number
        },
        include: {
          issuedBooks: true,
        },
      });
    }

    // console.log(libraryCard)
    // Return the library card details
    return {
      success: true,
      data: libraryCard,
    };
  } catch (error) {
    console.error("Error fetching or creating library card: ", error);
    return {
      success: false,
      message: "Error fetching or creating library card.",
    };
  }
}

export async function getLibraryCardDetails(cardNumber: string) {
  try {
    const libraryCard = await db.libraryCard.findUnique({
      where: {
        id: cardNumber,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        }, // Assuming you have a relation between LibraryCard and User
        issuedBooks: {
          include: {
            bookCopy: {
              include: {
                book: {
                  select: {
                    title: true,
                    author: true,
                  },
                },
              },
            }, // Include book details for each issued book
          },
        },
      },
    });

    if (!libraryCard) {
      throw new Error("Library card not found");
    }

    return {
      libraryCard,
      user: libraryCard.user,
    };
  } catch (error) {
    console.error("Error fetching library card details:", error);
    throw error;
  }
}

export async function updateUserProfile(input: UpdateUserProfileInput) {
  try {
    const { userId, ...data } = input;

    // Validate that userId is a non-empty string
    if (!userId || userId.trim() === "") {
      console.log("Invalid User ID");
      return { success: false, message: "Invalid User ID" };
    }

    // Retrieve the user to confirm existence
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log("User not found");
      return { success: false, message: "User not found" };
    }

    // Remove any undefined values from `data`
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== "")
    );

    // console.log("Filtered data to update:", filteredData);

    // Update the user profile in the database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: filteredData,
    });

    // console.log("Updated user:", updatedUser);

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return { success: false, message: "Failed to update profile." };
  }
}

export async function addDepartment(departmentName: string) {
  if (!departmentName || departmentName.trim() === '') {
    throw new Error('Department name is required');
  }
  try {

    const newDepartment = await db.department.create({
      data: {
        name: departmentName,
      }
    });

    return { ...newDepartment, batch: [] };  // Ensure batch is included
  } catch (error) {
    console.error('Error adding department:', error);
    throw new Error('Failed to add department');
  }
}

export async function addBatch(departmentId: string, batchName: string) {
  if (!departmentId || !batchName.trim()) {
    throw new Error('Department ID and batch name are required');
  }

  try {
    const response = await db.batch.create({
      data: {
        name: batchName,
        departmentId,  // Link the batch to the department
      },
    });

    return response; // Ensure this returns the Batch object
  } catch (error) {
    console.error('Error adding batch:', error);
    throw new Error('Failed to add batch');
  }
}

export async function getAllDepartments() {
  try {
    const departments = await db.department.findMany({
      include: {
        batch: true,
      }
    });
    return {
      success: true,
      departments
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments');
  }
}

export async function getAllBatches() {
  try {
    const batches = await db.batch.findMany();
    return {
      success: true,
      batches
    };
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new Error('Failed to fetch departments');
  }
}

export async function editBatch(departmentId: string, batchId: string, newBatchName: string) {
  if (!departmentId || !batchId || !newBatchName.trim()) {
    throw new Error('Department ID, Batch ID, and new batch name are required');
  }

  try {
    // Update the batch name
    const updatedBatch = await db.batch.update({
      where: {
        id: batchId,
      },
      data: {
        name: newBatchName,  // Set the new batch name
      },
    });

    return updatedBatch; // Return the updated batch
  } catch (error) {
    console.error('Error updating batch name:', error);
    throw new Error('Failed to update batch name');
  }
}

export async function addManagementUser(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  try {
    // Check if the email is already in use
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { success: false, message: 'Email is already in use.' };
    }

    // Hash the password
    const hashedPassword = saltAndHashPassword(password);

    // Create a new user with the "MANAGEMENT" role
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'MANAGEMENT', // Assign the MANAGEMENT role
      },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error('Error adding management user:', error);
    return { success: false, message: 'Failed to add management user.' };
  }
}

export async function getStudents(batchId: string, departmentId: string) {
  // console.log(batchId);
  try {
    const students = await db.user.findMany({
      where: { batchId, departmentId },
      include: {
        LibraryCard: true
      }
    });

    if (students.length === 0) {
      return { success: false, message: "No students found for the given batchId." };
      // console.log("No students found for the given batchId.");
    }

    // Transform the data to include only the specified fields
    const transformedStudents = students.map(student => {
      const { id, name, email } = student;
      const libraryCard = student.LibraryCard
        ? { id: student.LibraryCard.id, active: student.LibraryCard.active }
        : null; // Handle cases where LibraryCard might be null or undefined

      return { id, name, email, libraryCard };
    });

    return {
      success: true,
      students: transformedStudents,
    };
  } catch (err) {
    console.error("Error fetching student details with corresponding id", err);
    return {
      success: false,
      error: "Error fetching student details with corresponding id",
    };
  }
}

export async function deactiveStudentLibraryCard({
  studentId,
  departmentId,
  batchId,
}: {
  studentId: string;
  departmentId: string;
  batchId: string;
}) {
  try {
    if (departmentId && batchId && departmentId.trim() !== '' && batchId.trim() !== '') {
      console.log(departmentId, batchId);

      // Fetch all students in the specified batch and department with active LibraryCards
      const students = await db.user.findMany({
        where: { batchId, departmentId },
        include: {
          LibraryCard: {
            select: {
              id: true,
              active: true,
            },
          },
        },
      });

      // Extract libraryCard IDs where LibraryCard is defined and active
      const filteredIds = students
        .filter(student => student.LibraryCard && student.LibraryCard.active)
        .map(student => student.LibraryCard!.id);

      if (filteredIds.length === 0) {
        return {
          success: false,
          message: "No active Library Cards found for the given batch and department",
        };
      }

      // Update all filtered libraryCard IDs to inactive
      const libraryCards = await db.libraryCard.updateMany({
        where: { id: { in: filteredIds } },
        data: { active: false },
      });

      return {
        success: true,
        message: `${libraryCards.count} student Library Cards deactivated successfully`,
        libraryCards
      };
    } else {
      // Deactivate a single libraryCard by student ID
      const libraryCard = await db.libraryCard.update({
        where: { studentId },
        data: { active: false },
      });

      return {
        success: true,
        message: "Student's Library Card deactivated successfully",
        ...libraryCard,
      };
    }
  } catch (error) {
    console.error("Error deactivating student Library Cards:", error);
    return {
      success: false,
      error: "Error deactivating student Library Cards",
    };
  }
}

export async function getDefaulters(departmentId?: string) {
  try {
    const overdueIssues = await db.bookCopyIssue.findMany({
      where: {
        status: "issued",
        dueDate: {
          lt: new Date(),
        },
        libraryCard: {
          user: departmentId ? { departmentId } : undefined,
        },
      },
      include: {
        bookCopy: { include: { book: true } },
        libraryCard: { include: { user: true } },
      },
    });

    // console.log('overdueIssues:', overdueIssues);
    // return

    // Format data to simplify frontend usage
    const defaulters = overdueIssues.map((issue) => ({
      id: issue.id,
      bookTitle: issue.bookCopy.book.title,
      userName: issue.libraryCard.user?.name,
      dueDate: issue.dueDate,
      departmentId: issue.libraryCard.user?.departmentId,
    }));

    return { success: true, data: defaulters };
  } catch (error) {
    console.error("Error fetching defaulters:", error);
    return { success: false, error: "Failed to fetch defaulters." };
  }
}

// Helper function to generate a unique card number
function generateCardNumber(): string {
  return `LIB-${Math.floor(Math.random() * 1000000000)}`; // Simple example of card number generation
}

