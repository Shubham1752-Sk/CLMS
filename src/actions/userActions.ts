"use server"

import { db } from "@/db";
import { saltAndHashPassword } from "@/utils/helper";

export const getUserByEmail = async (email: string) =>{
    try{
        // console.log("in the func")
        const user = await db.user.findUnique({
            where: {
                email,
            }
        });
        // console.log(user)
        return user;
    }catch( error: any){
        console.error(error);
        return null;
    }
}


// Server Action to generate or fetch a student's library card details
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
        user: true, // Assuming you have a relation between LibraryCard and User
        issuedBooks: {
          include: {
            bookCopy: true, // Include book details for each issued book
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


interface UpdateUserProfileInput {
  userId: string;
  name?: string;
  email?: string;
  departmentId?: string;
  batchId?: string;
  image?: string;
}

export async function updateUserProfile(input: UpdateUserProfileInput) {
  try {
    const { userId, ...data } = input;

    console.log(data);

    return
    
    // Update the user profile in the database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data,
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return { success: false, error: 'Failed to update profile.' };
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

// In your addBatch function
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


// Helper function to generate a unique card number
function generateCardNumber(): string {
  return `LIB-${Math.floor(Math.random() * 1000000000)}`; // Simple example of card number generation
}

