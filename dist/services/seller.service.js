"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.sellerService = {
    async getSellerDashboard(sellerId) {
        const [booksCount, pendingOrdersCount, revenue, recentOrders] = await Promise.all([
            prisma_1.default.book.count({ where: { sellerId } }),
            prisma_1.default.order.count({
                where: {
                    items: {
                        some: {
                            book: {
                                sellerId
                            }
                        }
                    },
                    status: 'PENDING'
                }
            }),
            prisma_1.default.order.aggregate({
                where: {
                    items: {
                        some: {
                            book: {
                                sellerId
                            }
                        }
                    },
                    status: 'DELIVERED'
                },
                _sum: { totalAmount: true }
            }),
            prisma_1.default.order.findMany({
                where: {
                    items: {
                        some: {
                            book: {
                                sellerId
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            book: true
                        }
                    }
                }
            })
        ]);
        return {
            stats: {
                booksCount,
                pendingOrdersCount,
                revenue: revenue._sum?.totalAmount || 0
            },
            recentOrders
        };
    },
    async getAllUsers(params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma_1.default.user.count()
        ]);
        return {
            users,
            total
        };
    },
    async updateUserRole(userId, role) {
        return await prisma_1.default.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });
    },
    async getAllBooks(params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [books, total] = await Promise.all([
            prisma_1.default.book.findMany({
                include: {
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma_1.default.book.count()
        ]);
        return {
            books,
            total
        };
    },
    async approveBook(bookId) {
        return await prisma_1.default.book.update({
            where: { id: bookId },
            data: { isApproved: true },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    },
    async getAllOrders(params) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            prisma_1.default.order.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            book: {
                                include: {
                                    seller: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma_1.default.order.count()
        ]);
        return {
            orders,
            total
        };
    },
    async getAnalytics() {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear + 1, 0, 1);
        const monthlySalesRaw = await prisma_1.default.$queryRaw `
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COALESCE(SUM(totalAmount), 0) as revenue
      FROM \`Order\`
      WHERE 
        createdAt >= ${startOfYear}
        AND createdAt < ${endOfYear}
        AND status = 'DELIVERED'
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `;
        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, '0');
            return `${currentYear}-${month}`;
        });
        const monthlySales = allMonths.map(month => {
            const found = monthlySalesRaw.find(item => item.month === month);
            return {
                month,
                revenue: found ? Number(found.revenue) : 0
            };
        });
        const topSellingBooksRaw = await prisma_1.default.orderItem.groupBy({
            by: ['bookId'],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                    quantity: 'desc'
                }
            },
            take: 5
        });
        const bookIds = topSellingBooksRaw.map(item => item.bookId);
        const books = await prisma_1.default.book.findMany({
            where: { id: { in: bookIds } },
            include: {
                category: {
                    select: {
                        name: true
                    }
                }
            }
        });
        const topSellingBooks = topSellingBooksRaw.map(item => {
            const book = books.find(b => b.id === item.bookId);
            return book ? {
                ...book,
                totalSold: item._sum.quantity || 0
            } : null;
        }).filter(Boolean);
        const categoryDistributionRaw = await prisma_1.default.book.groupBy({
            by: ['categoryId'],
            _count: {
                id: true
            }
        });
        const categoryIds = categoryDistributionRaw.map(item => item.categoryId);
        const categories = await prisma_1.default.category.findMany({
            where: { id: { in: categoryIds } }
        });
        const categoryDistribution = categoryDistributionRaw.map(item => {
            const category = categories.find(c => c.id === item.categoryId);
            return {
                categoryId: item.categoryId,
                categoryName: category?.name || 'Unknown',
                count: item._count.id
            };
        });
        return {
            monthlySales,
            topSellingBooks,
            categoryDistribution
        };
    },
    async addBook(sellerId, bookData) {
        return await prisma_1.default.book.create({
            data: {
                ...bookData,
                sellerId,
                isApproved: false
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    },
    async validateCategoryExists(categoryId) {
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryId }
        });
        return !!category;
    },
    async updateBook(bookId, sellerId, bookData) {
        return await prisma_1.default.$transaction(async (tx) => {
            const book = await tx.book.findUnique({
                where: { id: bookId }
            });
            if (!book) {
                throw new Error('Book not found');
            }
            if (book.sellerId !== sellerId) {
                throw new Error('Access denied: You do not own this book');
            }
            return await tx.book.update({
                where: { id: bookId },
                data: bookData,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
        });
    },
    async deleteBook(bookId, sellerId) {
        return await prisma_1.default.$transaction(async (tx) => {
            const book = await tx.book.findUnique({
                where: { id: bookId }
            });
            if (!book) {
                throw new Error('Book not found');
            }
            if (book.sellerId !== sellerId) {
                throw new Error('Access denied: You do not own this book');
            }
            const orderItemsCount = await tx.orderItem.count({
                where: { bookId }
            });
            if (orderItemsCount > 0) {
                throw new Error('Cannot delete book: It has associated orders');
            }
            await tx.book.delete({
                where: { id: bookId }
            });
            return { message: 'Book deleted successfully' };
        });
    },
    async updateOrderStatus(orderId, sellerId, status) {
        return await prisma_1.default.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    items: {
                        include: {
                            book: true
                        }
                    }
                }
            });
            if (!order) {
                throw new Error('Order not found');
            }
            const sellerOwnsBook = order.items.some(item => item.book.sellerId === sellerId);
            if (!sellerOwnsBook) {
                throw new Error('Access denied: You do not own any books in this order');
            }
            return await tx.order.update({
                where: { id: orderId },
                data: { status },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    items: {
                        include: {
                            book: true
                        }
                    }
                }
            });
        });
    }
};
//# sourceMappingURL=seller.service.js.map