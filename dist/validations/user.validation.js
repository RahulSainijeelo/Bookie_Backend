"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressIdSchema = exports.addressSchema = exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .trim()
        .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
        .optional(),
    email: zod_1.z.string().email("Invalid email format").toLowerCase().optional(),
    phone: zod_1.z.string()
        .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must not exceed 20 characters")
        .optional()
        .nullable(),
    avatar: zod_1.z.string().url("Invalid URL format").optional().nullable()
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newPassword: zod_1.z.string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
});
exports.addressSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "Name is required")
        .max(100, "Name must not exceed 100 characters")
        .trim(),
    street: zod_1.z.string()
        .min(1, "Street is required")
        .max(255, "Street must not exceed 255 characters")
        .trim(),
    city: zod_1.z.string()
        .min(1, "City is required")
        .max(100, "City must not exceed 100 characters")
        .trim(),
    state: zod_1.z.string()
        .min(1, "State is required")
        .max(100, "State must not exceed 100 characters")
        .trim(),
    postalCode: zod_1.z.string()
        .min(1, "Postal code is required")
        .max(20, "Postal code must not exceed 20 characters")
        .trim(),
    country: zod_1.z.string()
        .min(1, "Country is required")
        .max(100, "Country must not exceed 100 characters")
        .trim(),
    isDefault: zod_1.z.boolean().default(false),
    phone: zod_1.z.string()
        .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format")
        .min(10, "Phone number must be at least 10 digits")
        .max(20, "Phone number must not exceed 20 characters")
        .optional()
        .nullable()
});
exports.addressIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid address ID")
});
//# sourceMappingURL=user.validation.js.map