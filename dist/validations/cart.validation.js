"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartItemIdSchema = exports.updateCartSchema = exports.addToCartSchema = void 0;
const zod_1 = require("zod");
exports.addToCartSchema = zod_1.z.object({
    bookId: zod_1.z.string().uuid("Invalid book ID"),
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1").default(1)
});
exports.updateCartSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1")
});
exports.cartItemIdSchema = zod_1.z.object({
    itemId: zod_1.z.string().uuid("Invalid cart item ID")
});
//# sourceMappingURL=cart.validation.js.map