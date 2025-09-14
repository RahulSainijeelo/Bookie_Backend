import { z } from 'zod';

export const userRoleSchema = z.object({
  role: z.enum(['USER', 'SELLER', 'ADMIN'])
});

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).trim(),
  author: z.string().min(1, "Author is required").max(255).trim(),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive").multipleOf(0.01), // Fixed decimal precision
  categoryId: z.string().min(1, "Category is required"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  imageUrl: z.string().url("Invalid image URL").optional().nullable()
});

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
});

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10)
});

export const bookIdSchema = z.object({
  id: z.string().uuid("Invalid book ID")
});

export const userIdSchema = z.object({
  id: z.string().uuid("Invalid user ID")
});

export const orderIdSchema = z.object({
  id: z.string().uuid("Invalid order ID")
});