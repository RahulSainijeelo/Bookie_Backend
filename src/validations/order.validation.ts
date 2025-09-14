import { z } from 'zod';

export const orderItemSchema = z.object({
  bookId: z.string().uuid("Invalid book ID"),
  quantity: z.number().int().positive("Quantity must be at least 1")
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  shippingAddress: z.string().min(5, "Valid shipping address is required"),
  billingAddress: z.string().min(5, "Valid billing address is required").optional(),
  paymentMethod: z.enum(["CREDIT_CARD", "PAYPAL", "STRIPE", "CASH_ON_DELIVERY"]),
  couponCode: z.string().optional()
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional()
});

export const orderIdSchema = z.object({
  id: z.string().uuid("Invalid order ID")
});