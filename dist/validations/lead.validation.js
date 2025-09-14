"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLeadSchema = void 0;
const zod_1 = require("zod");
exports.createLeadSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(2, 'Name must be at least 2 characters')
            .max(100, 'Name cannot exceed 100 characters')
            .trim(),
        phone: zod_1.z.string()
            .regex(/^\+?[\d\s\-\(\)\.]+$/, 'Invalid phone number format')
            .trim(),
        altPhone: zod_1.z.string()
            .regex(/^\+?[\d\s\-\(\)\.]+$/, 'Invalid alternate phone number format')
            .optional()
            .or(zod_1.z.literal('')),
        email: zod_1.z.string()
            .email('Invalid email address')
            .toLowerCase(),
        altEmail: zod_1.z.string()
            .email('Invalid alternate email address')
            .toLowerCase()
            .optional()
            .or(zod_1.z.literal('')),
        status: zod_1.z.enum(['New', 'Follow-Up', 'Qualified', 'Converted', 'Lost'])
            .default('New'),
        qualification: zod_1.z.enum(['High School', 'Bachelors', 'Masters', 'PhD', 'Other'])
            .default('High School'),
        interestField: zod_1.z.enum(['Web Development', 'Mobile Development', 'Data Science', 'Digital Marketing', 'UI/UX Design'])
            .default('Web Development'),
        source: zod_1.z.enum(['Website', 'Social Media', 'Email Campaign', 'Cold Call', 'Referral'])
            .default('Website'),
        assignedTo: zod_1.z.string()
            .min(1, 'Assigned to is required')
            .trim(),
        jobInterest: zod_1.z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'])
            .optional()
            .or(zod_1.z.literal('')),
        state: zod_1.z.string()
            .max(50, 'State name cannot exceed 50 characters')
            .optional()
            .or(zod_1.z.literal('')),
        city: zod_1.z.string()
            .max(50, 'City name cannot exceed 50 characters')
            .optional()
            .or(zod_1.z.literal('')),
        passoutYear: zod_1.z.number()
            .min(1990, 'Passout year must be after 1990')
            .max(new Date().getFullYear() + 10, 'Invalid passout year')
            .optional(),
        heardFrom: zod_1.z.string()
            .max(200, 'Heard from cannot exceed 200 characters')
            .optional()
            .or(zod_1.z.literal(''))
    })
});
//# sourceMappingURL=lead.validation.js.map