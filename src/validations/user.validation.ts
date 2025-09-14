import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim()
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
    .optional(),
  email: z.string().email("Invalid email format").toLowerCase().optional(),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .optional()
    .nullable(),
  avatar: z.string().url("Invalid URL format").optional().nullable()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
});

export const addressSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  street: z.string()
    .min(1, "Street is required")
    .max(255, "Street must not exceed 255 characters")
    .trim(),
  city: z.string()
    .min(1, "City is required")
    .max(100, "City must not exceed 100 characters")
    .trim(),
  state: z.string()
    .min(1, "State is required")
    .max(100, "State must not exceed 100 characters")
    .trim(),
  postalCode: z.string()
    .min(1, "Postal code is required")
    .max(20, "Postal code must not exceed 20 characters")
    .trim(),
  country: z.string()
    .min(1, "Country is required")
    .max(100, "Country must not exceed 100 characters")
    .trim(),
  isDefault: z.boolean().default(false),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must not exceed 20 characters")
    .optional()
    .nullable()
});

export const addressIdSchema = z.object({
  id: z.string().uuid("Invalid address ID")
});