"use server"

import { db } from "@/db";

// Fetch all genres
export async function fetchGenres() {
  try {
    const genres = await db.genre.findMany();
    return genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw new Error('Failed to fetch genres');
  }
}

// Add a new genre
export async function addGenre(genreName: string) {
  if (!genreName.trim()) {
    return { success: false, message: 'Genre name is required.' };
  }

  try {
    const existingGenre = await db.genre.findUnique({
      where: { name: genreName },
    });

    if (existingGenre) {
      return { success: false, message: 'Genre already exists.' };
    }

    const newGenre = await db.genre.create({
      data: {
        name: genreName,
      },
    });

    return { success: true, genre: newGenre };
  } catch (error) {
    console.error('Error adding genre:', error);
    return { success: false, message: 'Failed to add genre' };
  }
}

// Update an existing genre
export async function updateGenre(genreId: string, newName: string) {
  if (!newName.trim()) {
    return { success: false, message: 'Genre name is required.' };
  }

  try {
    const updatedGenre = await db.genre.update({
      where: { id: genreId },
      data: { name: newName },
    });

    return { success: true, genre: updatedGenre };
  } catch (error) {
    console.error('Error updating genre:', error);
    return { success: false, message: 'Failed to update genre' };
  }
}
