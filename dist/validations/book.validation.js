"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorySchema = exports.bookIdSchema = exports.reviewBodySchema = exports.reviewQuerySchema = exports.bookQuerySchema = void 0;
const zod_1 = require("zod");
exports.bookQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(val => Math.max(parseInt(val) || 1, 1)),
    limit: zod_1.z.string().transform(val => Math.min(Math.max(parseInt(val) || 10, 1), 100)),
    categoryId: zod_1.z.string().uuid().optional(),
    author: zod_1.z.string().optional(),
    minPrice: zod_1.z.string().transform(val => parseFloat(val)).optional(),
    maxPrice: zod_1.z.string().transform(val => parseFloat(val)).optional(),
    rating: zod_1.z.string().transform(val => parseFloat(val)).optional(),
    sortBy: zod_1.z.enum(['createdAt', 'title', 'author', 'price', 'rating']).default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).default('desc'),
    search: zod_1.z.string().optional(),
});
exports.reviewQuerySchema = zod_1.z.object({
    page: zod_1.z.string().transform(val => Math.max(parseInt(val) || 1, 1)),
    limit: zod_1.z.string().transform(val => Math.min(Math.max(parseInt(val) || 10, 1), 50)),
});
exports.reviewBodySchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
    comment: zod_1.z.string().min(1).max(1000).trim(),
});
exports.bookIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid book ID")
});
exports.categorySchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid("Invalid category ID")
});
//# sourceMappingURL=book.validation.js.map