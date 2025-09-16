"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = exports.CategoryExistsError = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class CategoryExistsError extends Error {
    constructor(message = 'Category already exists') {
        super(message);
        this.name = 'CategoryExistsError';
    }
}
exports.CategoryExistsError = CategoryExistsError;
exports.categoryService = {
    async getAllCategories() {
        return await prisma_1.default.category.findMany({
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
            orderBy: { name: 'asc' }
        });
    },
    async getCategoryById(id) {
        return await prisma_1.default.category.findUnique({
            where: { id },
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
            }
        });
    },
    async getBooksByCategory(categoryId, params) {
        const { page, limit, sortBy, sortOrder } = params;
        const where = {
            categoryId,
            isApproved: true
        };
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
                take: limit
            }),
            prisma_1.default.book.count({ where })
        ]);
        return { books, total };
    },
    async createCategory(categoryData) {
        const { name } = categoryData;
        const existingCategory = await prisma_1.default.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });
        if (existingCategory) {
            throw new CategoryExistsError(`Category '${name}' already exists`);
        }
        return await prisma_1.default.category.create({
            data: {
                name: name.trim()
            },
            include: {
                _count: {
                    select: {
                        books: true
                    }
                }
            }
        });
    }
};
//# sourceMappingURL=category.service.js.map