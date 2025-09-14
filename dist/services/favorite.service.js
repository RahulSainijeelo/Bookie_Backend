"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.favoriteService = {
    async getUserFavorites(userId, params) {
        const { page, limit, sortBy } = params;
        const skip = (page - 1) * limit;
        let favorites;
        if (sortBy === 'dateAdded') {
            favorites = await prisma_1.default.favorite.findMany({
                where: { userId },
                include: {
                    book: {
                        include: {
                            category: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });
        }
        else {
            const orderByField = sortBy === 'title' ? 'title' :
                sortBy === 'author' ? 'author' :
                    sortBy === 'price' ? 'price' : 'title';
            favorites = await prisma_1.default.favorite.findMany({
                where: { userId },
                include: {
                    book: {
                        include: {
                            category: true
                        }
                    }
                },
                orderBy: {
                    book: {
                        [orderByField]: 'asc'
                    }
                },
                skip,
                take: limit
            });
        }
        const total = await prisma_1.default.favorite.count({ where: { userId } });
        return { favorites, total };
    },
    formatFavoriteItem(favorite) {
        return {
            id: favorite.book.id,
            title: favorite.book.title,
            author: favorite.book.author,
            description: favorite.book.description,
            price: favorite.book.price,
            imageUrl: favorite.book.imageUrl,
            category: favorite.book.category,
            stock: favorite.book.stock,
            isApproved: favorite.book.isApproved,
            dateAdded: favorite.createdAt,
            favoriteId: favorite.id
        };
    },
    async addToFavorites(userId, bookId) {
        return await prisma_1.default.$transaction(async (tx) => {
            const book = await tx.book.findUnique({
                where: { id: bookId }
            });
            if (!book) {
                throw new Error('Book not found');
            }
            if (!book.isApproved) {
                throw new Error('Book is not available');
            }
            const existingFavorite = await tx.favorite.findFirst({
                where: {
                    userId,
                    bookId
                }
            });
            if (existingFavorite) {
                throw new Error('Book already in favorites');
            }
            return await tx.favorite.create({
                data: {
                    userId,
                    bookId
                },
                include: {
                    book: {
                        include: {
                            category: true
                        }
                    }
                }
            });
        });
    },
    async removeFromFavorites(userId, bookId) {
        return await prisma_1.default.$transaction(async (tx) => {
            const existingFavorite = await tx.favorite.findFirst({
                where: {
                    userId,
                    bookId
                }
            });
            if (!existingFavorite) {
                throw new Error('Favorite not found');
            }
            await tx.favorite.delete({
                where: { id: existingFavorite.id }
            });
            return true;
        });
    },
    async clearAllFavorites(userId) {
        const favoriteCount = await prisma_1.default.favorite.count({
            where: { userId }
        });
        if (favoriteCount === 0) {
            return { count: 0 };
        }
        const deleteResult = await prisma_1.default.favorite.deleteMany({
            where: { userId }
        });
        return { count: deleteResult.count };
    },
    async checkIsFavorite(userId, bookId) {
        const favorite = await prisma_1.default.favorite.findFirst({
            where: {
                userId,
                bookId
            }
        });
        return {
            isFavorite: !!favorite,
            favoriteId: favorite?.id || null
        };
    },
    async getFavoritesCount(userId) {
        return await prisma_1.default.favorite.count({
            where: { userId }
        });
    }
};
//# sourceMappingURL=favorite.service.js.map