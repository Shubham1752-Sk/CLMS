
import { z, object, string, number, boolean } from "zod";

export const signInSchema = object({
    email: string({ required_error: "Email is required" })
        .min(1, "Email is required")
        .email("Invalid email"),
    password: string({ required_error: "Password is required" })
        .min(1, "Password is required")
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
});

export const addBookSchema = object({
  title: string()
    .min(3, "Title must be at least 3 characters long."),
  author: string()
    .min(3, "Author must be at least 3 characters long."),
  publisher: z.string().optional(),
  copies: number()
    .min(1, "At least one copy is required.")
    .or(z.string().refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
      message: "Copies must be a valid positive number.",
    })),
  genreId: string().min(1, "Genre is required."),
  isEbookAvailable: z.boolean(),
  ebookUrl: z
    .string()
    .url("Invalid URL format.")
    .optional()
    .refine((url, ctx) => {
      const isEbookAvailable = ctx.parent.isEbookAvailable;
      if (isEbookAvailable && !url) {
        return false;
      }
      return true;
    }, {
      message: "E-book URL is required if the book is marked as available as an E-book.",
    }),
});

// Use this TypeScript type for the form data
export type AddBookFormData = z.infer<typeof addBookSchema>;
