"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.bookService = {
    async getAllBooks(params) {
        const { page, limit, categoryId, author, minPrice, maxPrice, rating, sortBy, sortOrder, search } = params;
        const where = {
            isApproved: true
        };
        if (categoryId)
            where.categoryId = categoryId;
        if (author) {
            where.author = {
                contains: author,
                mode: 'insensitive'
            };
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (rating !== undefined) {
            where.rating = { gte: rating };
        }
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [books, total] = await Promise.all([
            prisma_1.default.book.findMany({
                where,
                include: {
                    category: true,
                    seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            reviews: true
                        }
                    }
                },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.default.book.count({ where })
        ]);
        return { books, total };
    },
    async getBookById(id) {
        return prisma_1.default.book.findUnique({
            where: { id },
            include: {
                category: true,
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 5
                },
                _count: {
                    select: {
                        reviews: true
                    }
                }
            }
        });
    },
    async getBooksByCategory(categoryId, options) {
        const { page, limit, sortBy, sortOrder } = options;
        const [books, total] = await Promise.all([
            prisma_1.default.book.findMany({
                where: {
                    categoryId,
                    isApproved: true
                },
                include: {
                    category: true,
                    seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            reviews: true
                        }
                    }
                },
                orderBy: {
                    [sortBy]: sortOrder
                },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma_1.default.book.count({
                where: {
                    categoryId,
                    isApproved: true
                }
            })
        ]);
        return { books, total };
    },
    async getBookReviews(bookId, page, limit) {
        const [reviews, total] = await Promise.all([
            prisma_1.default.review.findMany({
                where: { bookId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma_1.default.review.count({
                where: { bookId }
            })
        ]);
        return { reviews, total };
    },
    async addBookReview(bookId, userId, data) {
        return prisma_1.default.$transaction(async (tx) => {
            const book = await tx.book.findUnique({
                where: { id: bookId },
                select: {
                    id: true,
                    isApproved: true,
                    sellerId: true,
                    title: true
                }
            });
            if (!book || !book.isApproved) {
                throw new Error('Book not found');
            }
            if (book.sellerId === userId) {
                throw new Error('You cannot review your own book');
            }
            const existingReview = await tx.review.findFirst({
                where: {
                    bookId,
                    userId
                }
            });
            if (existingReview) {
                throw new Error('You have already reviewed this book');
            }
            const review = await tx.review.create({
                data: {
                    rating: data.rating,
                    comment: data.comment,
                    userId,
                    bookId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });
            const avgRating = await tx.review.aggregate({
                where: { bookId },
                _avg: {
                    rating: true
                }
            });
            await tx.book.update({
                where: { id: bookId },
                data: {
                    rating: avgRating._avg.rating || 0
                }
            });
            return { review, book };
        });
    },
    async getCategories() {
        return prisma_1.default.category.findMany({
            include: {
                _count: {
                    select: {
                        books: {
                            where: {
                                isApproved: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
    },
    async getFeaturedBooks() {
        const [topRated, recent] = await Promise.all([
            prisma_1.default.book.findMany({
                where: {
                    isApproved: true,
                    rating: {
                        gte: 4.0
                    }
                },
                include: {
                    category: true,
                    seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            reviews: true
                        }
                    }
                },
                orderBy: {
                    rating: 'desc'
                },
                take: 6
            }),
            prisma_1.default.book.findMany({
                where: {
                    isApproved: true
                },
                include: {
                    category: true,
                    seller: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 6
            })
        ]);
        return { topRated, recent };
    }
};
//# sourceMappingURL=book.service.js.map