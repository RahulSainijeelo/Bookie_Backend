"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedBooks = exports.getBookCategories = exports.searchBooks = exports.addBookReview = exports.getBookReviews = exports.getBooksByCategory = exports.getBookById = exports.getAllBooks = void 0;
const book_service_1 = require("../services/book.service");
const api_utils_1 = require("../utils/api.utils");
const book_validation_1 = require("../validations/book.validation");
const prisma_1 = __importDefault(require("../lib/prisma"));
const checkAuth = (req) => {
    return req.user?.id || null;
};
const getAllBooks = async (req, res) => {
    try {
        const validationResult = book_validation_1.bookQuerySchema.safeParse(req.query);
        if (!validationResult.success) {
            res.status(400).json({
                message: 'Invalid query parameters',
                errors: validationResult.error.format()
            });
            return;
        }
        const params = validationResult.data;
        const { books, total } = await book_service_1.bookService.getAllBooks(params);
        res.json({
            books,
            ...(0, api_utils_1.createPaginationResponse)(books, params.page, params.limit, total)
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching books');
    }
};
exports.getAllBooks = getAllBooks;
const getBookById = async (req, res) => {
    try {
        const paramValidation = book_validation_1.bookIdSchema.safeParse(req.params);
        if (!paramValidation.success) {
            res.status(400).json({
                message: 'Invalid book ID',
                errors: paramValidation.error.format()
            });
            return;
        }
        const { id } = paramValidation.data;
        const book = await book_service_1.bookService.getBookById(id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        const userId = checkAuth(req);
        if (!book.isApproved && book.sellerId !== userId) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(book);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching book');
    }
};
exports.getBookById = getBookById;
const getBooksByCategory = async (req, res) => {
    try {
        const paramValidation = book_validation_1.categorySchema.safeParse(req.params);
        if (!paramValidation.success) {
            res.status(400).json({
                message: 'Invalid category ID',
                errors: paramValidation.error.format()
            });
            return;
        }
        const queryValidation = book_validation_1.bookQuerySchema.partial().safeParse(req.query);
        if (!queryValidation.success) {
            res.status(400).json({
                message: 'Invalid query parameters',
                errors: queryValidation.error.format()
            });
            return;
        }
        const { categoryId } = paramValidation.data;
        const queryParams = queryValidation.data;
        const category = await prisma_1.default.category.findUnique({
            where: { id: categoryId }
        });
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const { books, total } = await book_service_1.bookService.getBooksByCategory(categoryId, {
            page: queryParams.page || 1,
            limit: queryParams.limit || 10,
            sortBy: queryParams.sortBy || 'createdAt',
            sortOrder: queryParams.sortOrder || 'desc'
        });
        res.json({
            books,
            category,
            ...(0, api_utils_1.createPaginationResponse)(books, queryParams.page || 1, queryParams.limit || 10, total)
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching books by category');
    }
};
exports.getBooksByCategory = getBooksByCategory;
const getBookReviews = async (req, res) => {
    try {
        const paramValidation = book_validation_1.bookIdSchema.safeParse(req.params);
        if (!paramValidation.success) {
            res.status(400).json({
                message: 'Invalid book ID',
                errors: paramValidation.error.format()
            });
            return;
        }
        const validationResult = book_validation_1.reviewQuerySchema.safeParse(req.query);
        if (!validationResult.success) {
            res.status(400).json({
                message: 'Invalid query parameters',
                errors: validationResult.error.format()
            });
            return;
        }
        const { id } = paramValidation.data;
        const { page, limit } = validationResult.data;
        const book = await prisma_1.default.book.findUnique({
            where: { id },
            select: {
                id: true,
                isApproved: true,
                title: true
            }
        });
        if (!book || !book.isApproved) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        const { reviews, total } = await book_service_1.bookService.getBookReviews(id, page, limit);
        res.json({
            reviews,
            book: {
                id: book.id,
                title: book.title
            },
            ...(0, api_utils_1.createPaginationResponse)(reviews, page, limit, total)
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching book reviews');
    }
};
exports.getBookReviews = getBookReviews;
const addBookReview = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const paramValidation = book_validation_1.bookIdSchema.safeParse(req.params);
        if (!paramValidation.success) {
            res.status(400).json({
                message: 'Invalid book ID',
                errors: paramValidation.error.format()
            });
            return;
        }
        const validationResult = book_validation_1.reviewBodySchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: validationResult.error.format()
            });
            return;
        }
        const { id } = paramValidation.data;
        const reviewData = validationResult.data;
        try {
            const result = await book_service_1.bookService.addBookReview(id, userId, reviewData);
            res.status(201).json({
                review: result.review,
                book: {
                    id: result.book.id,
                    title: result.book.title
                }
            });
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Book not found') {
                    res.status(404).json({ message: 'Book not found' });
                    return;
                }
                if (['You have already reviewed this book', 'You cannot review your own book'].includes(error.message)) {
                    res.status(400).json({ message: error.message });
                    return;
                }
            }
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error adding review');
    }
};
exports.addBookReview = addBookReview;
const searchBooks = async (req, res) => {
    try {
        await (0, exports.getAllBooks)(req, res);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error searching books');
    }
};
exports.searchBooks = searchBooks;
const getBookCategories = async (req, res) => {
    try {
        const categories = await book_service_1.bookService.getCategories();
        res.json(categories);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching categories');
    }
};
exports.getBookCategories = getBookCategories;
const getFeaturedBooks = async (req, res) => {
    try {
        const featuredBooks = await book_service_1.bookService.getFeaturedBooks();
        res.json(featuredBooks);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching featured books');
    }
};
exports.getFeaturedBooks = getFeaturedBooks;
//# sourceMappingURL=book.controller.js.map