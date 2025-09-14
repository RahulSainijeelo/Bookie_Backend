"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookIdSchema = exports.favoriteQuerySchema = void 0;
const zod_1 = require("zod");
exports.favoriteQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().optional().default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(10),
    sortBy: zod_1.z.enum(['dateAdded', 'title', 'author', 'price']).optional().default('dateAdded')
});
exports.bookIdSchema = zod_1.z.object({
    bookId: zod_1.z.string().uuid("Invalid book ID")
});
//# sourceMappingURL=favorite.validation.js.map