import { z } from 'zod';

export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category ID")
});

export const categoryQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(50).default(10),
  sortBy: z.enum(['title', 'author', 'price', 'rating', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});