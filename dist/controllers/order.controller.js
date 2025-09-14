"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderTracking = exports.cancelOrder = exports.getOrderById = exports.getUserOrders = exports.createOrder = void 0;
const order_validation_1 = require("../validations/order.validation");
const order_service_1 = require("../services/order.service");
const api_utils_1 = require("../utils/api.utils");
const order_utils_1 = require("../utils/order.utils");
const checkAuth = (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return null;
    }
    return userId;
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
const createOrder = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const orderData = validateData(order_validation_1.createOrderSchema, req.body, res);
        if (!orderData)
            return;
        try {
            const order = await order_service_1.orderService.createOrder(userId, orderData);
            await order_service_1.orderService.clearUserCart(userId);
            res.status(201).json({
                message: 'Order created successfully',
                order
            });
        }
        catch (error) {
            if ((0, order_utils_1.handleOrderError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error creating order');
    }
};
exports.createOrder = createOrder;
const getUserOrders = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateData(order_validation_1.orderQuerySchema, req.query, res);
        if (!params)
            return;
        const { orders, total } = await order_service_1.orderService.getUserOrders(userId, params);
        res.json({
            orders,
            pagination: {
                currentPage: params.page,
                totalPages: Math.ceil(total / params.limit),
                limit: params.limit,
                total
            }
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching orders');
    }
};
exports.getUserOrders = getUserOrders;
const getOrderById = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateData(order_validation_1.orderIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const order = await order_service_1.orderService.getOrderById(userId, params.id);
            res.json(order);
        }
        catch (error) {
            if ((0, order_utils_1.handleOrderError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching order');
    }
};
exports.getOrderById = getOrderById;
const cancelOrder = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateData(order_validation_1.orderIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const result = await order_service_1.orderService.cancelOrder(userId, params.id);
            res.json(result);
        }
        catch (error) {
            if ((0, order_utils_1.handleOrderError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error cancelling order');
    }
};
exports.cancelOrder = cancelOrder;
const getOrderTracking = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateData(order_validation_1.orderIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const tracking = await order_service_1.orderService.getOrderTracking(userId, params.id);
            res.json(tracking);
        }
        catch (error) {
            if ((0, order_utils_1.handleOrderError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching tracking information');
    }
};
exports.getOrderTracking = getOrderTracking;
//# sourceMappingURL=order.controller.js.map