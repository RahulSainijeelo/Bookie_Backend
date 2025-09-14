"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.orderService = {
    async createOrder(userId, orderData) {
        const { items, shippingAddress, billingAddress, paymentMethod, couponCode } = orderData;
        const bookIds = items.map(item => item.bookId);
        const books = await prisma_1.default.book.findMany({
            where: { id: { in: bookIds } }
        });
        if (books.length !== bookIds.length) {
            throw new Error('One or more books not found');
        }
        let totalAmount = 0;
        const orderItems = items.map(item => {
            const book = books.find(b => b.id === item.bookId);
            if (!book) {
                throw new Error(`Book not found: ${item.bookId}`);
            }
            if ((book.stock || 0) < item.quantity) {
                throw new Error(`Not enough stock for book: ${book.title}`);
            }
            const itemTotal = book.price * item.quantity;
            totalAmount += itemTotal;
            return {
                bookId: item.bookId,
                quantity: item.quantity,
                price: book.price
            };
        });
        if (couponCode) {
            const coupon = await prisma_1.default.coupon.findUnique({
                where: { code: couponCode }
            });
            if (coupon && coupon.isActive && coupon.expiryDate > new Date()) {
                totalAmount = totalAmount * (1 - coupon.discountPercentage / 100);
            }
            else if (coupon) {
                throw new Error('Coupon is expired or inactive');
            }
            else {
                throw new Error('Invalid coupon code');
            }
        }
        return await prisma_1.default.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    shippingAddress,
                    billingAddress,
                    paymentMethod,
                    couponCode,
                    totalAmount,
                    status: 'PENDING',
                    items: {
                        create: orderItems
                    }
                },
                include: {
                    items: {
                        include: {
                            book: true
                        }
                    }
                }
            });
            for (const item of items) {
                await tx.book.update({
                    where: { id: item.bookId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }
            await tx.orderTracking.create({
                data: {
                    orderId: newOrder.id,
                    status: 'Order Placed',
                    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                }
            });
            return newOrder;
        });
    },
    async getUserOrders(userId, params) {
        const { page, limit, status } = params;
        const where = { userId };
        if (status)
            where.status = status;
        const [orders, total] = await Promise.all([
            prisma_1.default.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            book: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma_1.default.order.count({ where })
        ]);
        return { orders, total };
    },
    async getOrderById(userId, orderId) {
        const order = await prisma_1.default.order.findFirst({
            where: {
                id: orderId,
                userId
            },
            include: {
                items: {
                    include: {
                        book: true
                    }
                },
                tracking: true
            }
        });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    },
    async cancelOrder(userId, orderId) {
        const order = await prisma_1.default.order.findFirst({
            where: {
                id: orderId,
                userId
            },
            include: {
                items: true
            }
        });
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
            throw new Error(`Order cannot be cancelled in ${order.status} state`);
        }
        await prisma_1.default.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });
            await tx.orderTracking.update({
                where: { orderId },
                data: {
                    status: 'Order Cancelled',
                    lastUpdated: new Date()
                }
            });
            for (const item of order.items) {
                await tx.book.update({
                    where: { id: item.bookId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }
        });
        return { message: 'Order cancelled successfully' };
    },
    async getOrderTracking(userId, orderId) {
        const order = await prisma_1.default.order.findFirst({
            where: {
                id: orderId,
                userId
            },
            select: { id: true }
        });
        if (!order) {
            throw new Error('Order not found');
        }
        const tracking = await prisma_1.default.orderTracking.findUnique({
            where: { orderId }
        });
        if (!tracking) {
            throw new Error('Tracking information not found');
        }
        return tracking;
    },
    async clearUserCart(userId) {
        const cart = await prisma_1.default.cart.findUnique({
            where: { userId },
            select: { id: true }
        });
        if (cart) {
            await prisma_1.default.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }
        return true;
    }
};
//# sourceMappingURL=order.service.js.map