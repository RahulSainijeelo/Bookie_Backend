import { z } from 'zod';

export const favoriteQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  sortBy: z.enum(['dateAdded', 'title', 'author', 'price']).optional().default('dateAdded')
});

export const bookIdSchema = z.object({
  bookId: z.string().uuid("Invalid book ID")
});