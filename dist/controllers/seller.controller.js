"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.deleteBook = exports.updateBook = exports.addBook = exports.getAnalytics = exports.getAllOrders = exports.approveBook = exports.getAllBooksSeller = exports.updateUserRole = exports.getAllUsers = exports.getSellerDashboard = void 0;
const seller_service_1 = require("../services/seller.service");
const seller_validation_1 = require("../validations/seller.validation");
const api_utils_1 = require("../utils/api.utils");
const seller_utils_1 = require("../utils/seller.utils");
const checkAuth = (req, res) => {
    const sellerId = req.user?.id;
    if (!sellerId) {
        res.status(401).json({ message: 'Unauthorized' });
        return null;
    }
    return sellerId;
};
const validateData = (schema, data, res) => {
    const validation = schema.safeParse(data);
    if (!validation.success) {
        res.status(400).json({
            message: 'Validation error',
            errors: validation.error.format()
        });
        return null;
    }
    return validation.data;
};
const getSellerDashboard = async (req, res) => {
    try {
        const sellerId = checkAuth(req, res);
        if (!sellerId)
            return;
        const dashboardData = await seller_service_1.sellerService.getSellerDashboard(sellerId);
        res.json(dashboardData);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching seller dashboard');
    }
};
exports.getSellerDashboard = getSellerDashboard;
const getAllUsers = async (req, res) => {
    try {
        const params = validateData(seller_validation_1.paginationSchema, req.query, res);
        if (!params)
            return;
        const { users, total } = await seller_service_1.sellerService.getAllUsers(params);
        res.json({
            users,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                pages: Math.ceil(total / params.limit)
            }
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching users');
    }
};
exports.getAllUsers = getAllUsers;
const updateUserRole = async (req, res) => {
    try {
        const params = validateData(seller_validation_1.userIdSchema, req.params, res);
        if (!params)
            return;
        const roleData = validateData(seller_validation_1.userRoleSchema, req.body, res);
        if (!roleData)
            return;
        try {
            const updatedUser = await seller_service_1.sellerService.updateUserRole(params.id, roleData.role);
            res.json(updatedUser);
        }
        catch (error) {
            if ((0, seller_utils_1.handleSellerError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error updating user role');
    }
};
exports.updateUserRole = updateUserRole;
const getAllBooksSeller = async (req, res) => {
    try {
        const params = validateData(seller_validation_1.paginationSchema, req.query, res);
        if (!params)
            return;
        const { books, total } = await seller_service_1.sellerService.getAllBooks(params);
        res.json({
            books,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                pages: Math.ceil(total / params.limit)
            }
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching books for seller');
    }
};
exports.getAllBooksSeller = getAllBooksSeller;
const approveBook = async (req, res) => {
    try {
        const params = validateData(seller_validation_1.bookIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const updatedBook = await seller_service_1.sellerService.approveBook(params.id);
            res.json(updatedBook);
        }
        catch (error) {
            if ((0, seller_utils_1.handleSellerError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error approving book');
    }
};
exports.approveBook = approveBook;
const getAllOrders = async (req, res) => {
    try {
        const params = validateData(seller_validation_1.paginationSchema, req.query, res);
        if (!params)
            return;
        const { orders, total } = await seller_service_1.sellerService.getAllOrders(params);
        res.json({
            orders,
            pagination: {
                page: params.page,
                limit: params.limit,
                total,
                pages: Math.ceil(total / params.limit)
            }
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching orders');
    }
};
exports.getAllOrders = getAllOrders;
const getAnalytics = async (req, res) => {
    try {
        const analytics = await seller_service_1.sellerService.getAnalytics();
        res.json(analytics);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching analytics');
    }
};
exports.getAnalytics = getAnalytics;
const addBook = async (req, res) => {
    try {
        const sellerId = checkAuth(req, res);
        if (!sellerId)
            return;
        const bookData = validateData(seller_validation_1.bookSchema, req.body, res);
        if (!bookData)
            return;
        const categoryExists = await seller_service_1.sellerService.validateCategoryExists(bookData.categoryId);
        if (!categoryExists) {
            res.status(400).json({ message: 'Invalid category ID' });
            return;
        }
        const newBook = await seller_service_1.sellerService.addBook(sellerId, bookData);
        res.status(201).json(newBook);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error adding book');
    }
};
exports.addBook = addBook;
const updateBook = async (req, res) => {
    try {
        const sellerId = checkAuth(req, res);
        if (!sellerId)
            return;
        const params = validateData(seller_validation_1.bookIdSchema, req.params, res);
        if (!params)
            return;
        const bookData = validateData(seller_validation_1.bookSchema.partial(), req.body, res);
        if (!bookData)
            return;
        if (bookData.categoryId) {
            const categoryExists = await seller_service_1.sellerService.validateCategoryExists(bookData.categoryId);
            if (!categoryExists) {
                res.status(400).json({ message: 'Invalid category ID' });
                return;
            }
        }
        try {
            const updatedBook = await seller_service_1.sellerService.updateBook(params.id, sellerId, bookData);
            res.json(updatedBook);
        }
        catch (error) {
            if ((0, seller_utils_1.handleSellerError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error updating book');
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const sellerId = checkAuth(req, res);
        if (!sellerId)
            return;
        const params = validateData(seller_validation_1.bookIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const result = await seller_service_1.sellerService.deleteBook(params.id, sellerId);
            res.json(result);
        }
        catch (error) {
            if ((0, seller_utils_1.handleSellerError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error deleting book');
    }
};
exports.deleteBook = deleteBook;
const updateOrderStatus = async (req, res) => {
    try {
        const sellerId = checkAuth(req, res);
        if (!sellerId)
            return;
        const params = validateData(seller_validation_1.orderIdSchema, req.params, res);
        if (!params)
            return;
        const statusData = validateData(seller_validation_1.orderStatusSchema, req.body, res);
        if (!statusData)
            return;
        try {
            const updatedOrder = await seller_service_1.sellerService.updateOrderStatus(params.id, sellerId, statusData.status);
            res.json(updatedOrder);
        }
        catch (error) {
            if ((0, seller_utils_1.handleSellerError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error updating order status');
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=seller.controller.js.map