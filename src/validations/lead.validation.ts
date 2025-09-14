import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    
    phone: z.string()
      .regex(/^\+?[\d\s\-\(\)\.]+$/, 'Invalid phone number format')
      .trim(),
    
    altPhone: z.string()
      .regex(/^\+?[\d\s\-\(\)\.]+$/, 'Invalid alternate phone number format')
      .optional()
      .or(z.literal('')),
    
    email: z.string()
      .email('Invalid email address')
      .toLowerCase(),
    
    altEmail: z.string()
      .email('Invalid alternate email address')
      .toLowerCase()
      .optional()
      .or(z.literal('')),
    
    status: z.enum(['New', 'Follow-Up', 'Qualified', 'Converted', 'Lost'])
      .default('New'),
    
    qualification: z.enum(['High School', 'Bachelors', 'Masters', 'PhD', 'Other'])
      .default('High School'),
    
    interestField: z.enum(['Web Development', 'Mobile Development', 'Data Science', 'Digital Marketing', 'UI/UX Design'])
      .default('Web Development'),
    
    source: z.enum(['Website', 'Social Media', 'Email Campaign', 'Cold Call', 'Referral'])
      .default('Website'),
    
    assignedTo: z.string()
      .min(1, 'Assigned to is required')
      .trim(),
    
    jobInterest: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'])
      .optional()
      .or(z.literal('')),
    
    state: z.string()
      .max(50, 'State name cannot exceed 50 characters')
      .optional()
      .or(z.literal('')),
    
    city: z.string()
      .max(50, 'City name cannot exceed 50 characters')
      .optional()
      .or(z.literal('')),
    
    passoutYear: z.number()
      .min(1990, 'Passout year must be after 1990')
      .max(new Date().getFullYear() + 10, 'Invalid passout year')
      .optional(),
    
    heardFrom: z.string()
      .max(200, 'Heard from cannot exceed 200 characters')
      .optional()
      .or(z.literal(''))
  })
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>['body'];