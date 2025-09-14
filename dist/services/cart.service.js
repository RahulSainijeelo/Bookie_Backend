"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.cartService = {
    async getCart(userId) {
        return await prisma_1.default.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        book: true
                    }
                }
            }
        });
    },
    async addToCart(userId, bookId, quantity) {
        return await prisma_1.default.$transaction(async (tx) => {
            const book = await tx.book.findUnique({
                where: { id: bookId }
            });
            if (!book) {
                throw new Error('Book not found');
            }
            if (!book.isApproved) {
                throw new Error('Book is not approved for sale');
            }
            if ((book.stock || 0) < quantity) {
                throw new Error(`Not enough stock. Only ${book.stock} available.`);
            }
            let cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (!cart) {
                cart = await tx.cart.create({
                    data: {
                        userId,
                        items: {
                            create: {
                                bookId,
                                quantity,
                                price: book.price
                            }
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
            }
            else {
                const existingItem = cart.items.find(item => item.bookId === bookId);
                if (existingItem) {
                    const newQuantity = existingItem.quantity + quantity;
                    if ((book.stock || 0) < newQuantity) {
                        throw new Error(`Not enough stock. Only ${book.stock} available, you already have ${existingItem.quantity} in cart.`);
                    }
                    await tx.cartItem.update({
                        where: { id: existingItem.id },
                        data: { quantity: newQuantity }
                    });
                }
                else {
                    await tx.cartItem.create({
                        data: {
                            cartId: cart.id,
                            bookId,
                            quantity,
                            price: book.price
                        }
                    });
                }
                cart = await tx.cart.findUnique({
                    where: { userId },
                    include: {
                        items: {
                            include: {
                                book: true
                            }
                        }
                    }
                });
            }
            return cart;
        });
    },
    async updateCartItem(userId, itemId, quantity) {
        return await prisma_1.default.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (!cart) {
                throw new Error('Cart not found');
            }
            const cartItem = cart.items.find(item => item.id === itemId);
            if (!cartItem) {
                throw new Error('Item not found in cart');
            }
            const book = await tx.book.findUnique({
                where: { id: cartItem.bookId }
            });
            if (!book) {
                throw new Error('Book not found');
            }
            if ((book.stock || 0) < quantity) {
                throw new Error(`Not enough stock. Only ${book.stock} available.`);
            }
            await tx.cartItem.update({
                where: { id: itemId },
                data: { quantity }
            });
            return await tx.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            book: true
                        }
                    }
                }
            });
        });
    },
    async removeCartItem(userId, itemId) {
        return await prisma_1.default.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: true }
            });
            if (!cart) {
                throw new Error('Cart not found');
            }
            const cartItem = cart.items.find(item => item.id === itemId);
            if (!cartItem) {
                throw new Error('Item not found in cart');
            }
            await tx.cartItem.delete({
                where: { id: itemId }
            });
            return await tx.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            book: true
                        }
                    }
                }
            });
        });
    },
    async clearCart(userId) {
        return await prisma_1.default.$transaction(async (tx) => {
            const cart = await tx.cart.findUnique({
                where: { userId }
            });
            if (!cart) {
                return null;
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
            return true;
        });
    },
    async getCartItemCount(userId) {
        const cart = await prisma_1.default.cart.findUnique({
            where: { userId },
            include: {
                items: true
            }
        });
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
    },
    calculateCartTotal(items) {
        return items.reduce((sum, item) => sum + (item.quantity * item.book.price), 0);
    }
};
//# sourceMappingURL=cart.service.js.map