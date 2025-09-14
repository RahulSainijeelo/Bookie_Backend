import { z } from 'zod';

export const addToCartSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  quantity: z.number().int().positive("Quantity must be at least 1").default(1)
});

export const updateCartSchema = z.object({
  quantity: z.number().int().positive("Quantity must be at least 1")
});

export const cartItemIdSchema = z.object({
  itemId: z.string().uuid("Invalid cart item ID")
});