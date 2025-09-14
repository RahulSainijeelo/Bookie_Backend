import { z } from 'zod';

export const bookQuerySchema = z.object({
  page: z.string().transform(val => Math.max(parseInt(val) || 1, 1)),
  limit: z.string().transform(val => Math.min(Math.max(parseInt(val) || 10, 1), 100)),
  categoryId: z.string().uuid().optional(),
  author: z.string().optional(),
  minPrice: z.string().transform(val => parseFloat(val)).optional(),
  maxPrice: z.string().transform(val => parseFloat(val)).optional(),
  rating: z.string().transform(val => parseFloat(val)).optional(),
  sortBy: z.enum(['createdAt', 'title', 'author', 'price', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
});

export const reviewQuerySchema = z.object({
  page: z.string().transform(val => Math.max(parseInt(val) || 1, 1)),
  limit: z.string().transform(val => Math.min(Math.max(parseInt(val) || 10, 1), 50)),
});

export const reviewBodySchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000).trim(),
});

export const bookIdSchema = z.object({
  id: z.string().uuid("Invalid book ID")
});

export const categorySchema = z.object({
  categoryId: z.string().uuid("Invalid category ID")
});