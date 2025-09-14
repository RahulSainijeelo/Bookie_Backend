"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdSchema = exports.userIdSchema = exports.bookIdSchema = exports.paginationSchema = exports.orderStatusSchema = exports.bookSchema = exports.userRoleSchema = void 0;
const zod_1 = require("zod");
exports.userRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(['USER', 'SELLER', 'ADMIN'])
});
exports.bookSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(255).trim(),
    author: zod_1.z.string().min(1, "Author is required").max(255).trim(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive("Price must be positive").multipleOf(0.01),
    categoryId: zod_1.z.string().min(1, "Category is required"),
    stock: zod_1.z.number().int().nonnegative("Stock cannot be negative"),
    imageUrl: zod_1.z.string().url("Invalid image URL").optional().nullable()
});
exports.orderStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().positive().default(1),
    limit: zod_1.z.coerce.number().positive().max(100).default(10)
});
exports.bookIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid book ID")
});
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid user ID")
});
exports.orderIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid order ID")
});
//# sourceMappingURL=seller.validation.js.map