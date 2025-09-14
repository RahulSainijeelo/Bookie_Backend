"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdSchema = exports.orderQuerySchema = exports.createOrderSchema = exports.orderItemSchema = void 0;
const zod_1 = require("zod");
exports.orderItemSchema = zod_1.z.object({
    bookId: zod_1.z.string().uuid("Invalid book ID"),
    quantity: zod_1.z.number().int().positive("Quantity must be at least 1")
});
exports.createOrderSchema = zod_1.z.object({
    items: zod_1.z.array(exports.orderItemSchema).min(1, "Order must contain at least one item"),
    shippingAddress: zod_1.z.string().min(5, "Valid shipping address is required"),
    billingAddress: zod_1.z.string().min(5, "Valid billing address is required").optional(),
    paymentMethod: zod_1.z.enum(["CREDIT_CARD", "PAYPAL", "STRIPE", "CASH_ON_DELIVERY"]),
    couponCode: zod_1.z.string().optional()
});
exports.orderQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().optional().default(1),
    limit: zod_1.z.coerce.number().optional().default(10),
    status: zod_1.z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional()
});
exports.orderIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Invalid order ID")
});
//# sourceMappingURL=order.validation.js.map