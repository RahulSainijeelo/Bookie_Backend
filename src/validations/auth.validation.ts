import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),

  email: z.string()
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  
  role: z.enum(['USER', 'SELLER'])
    .default('USER')
});

export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .trim()
    .toLowerCase(),
  
  password: z.string()
    .min(1, "Password is required"),
     
  role: z.enum(['USER', 'SELLER'])
});