"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategorySchema = exports.categoryQuerySchema = exports.categoryIdSchema = void 0;
const zod_1 = require("zod");
exports.categoryIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid category ID")
});
exports.categoryQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().positive().default(1),
    limit: zod_1.z.coerce.number().positive().max(50).default(10),
    sortBy: zod_1.z.enum(['title', 'author', 'price', 'rating', 'createdAt']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc')
});
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, "Category name is required")
        .max(100, "Category name must not exceed 100 characters")
        .trim()
        .regex(/^[a-zA-Z0-9\s\-&]+$/, "Category name can only contain letters, numbers, spaces, hyphens, and ampersands")
});
//# sourceMappingURL=category.validation.js.map