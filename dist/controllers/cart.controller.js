"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItemCount = exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const cart_service_1 = require("../services/cart.service");
const api_utils_1 = require("../utils/api.utils");
const cart_validation_1 = require("../validations/cart.validation");
const checkAuth = (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return null;
    }
    return userId;
};
const formatCartResponse = (cart) => {
    const items = cart?.items || [];
    const total = cart_service_1.cartService.calculateCartTotal(items);
    return { items, total };
};
const handleCartError = (error, res) => {
    if (error instanceof Error) {
        if (['Cart not found', 'Item not found in cart', 'Book not found'].includes(error.message)) {
            res.status(404).json({ message: error.message });
            return true;
        }
        if (error.message.includes('Not enough stock') || error.message.includes('not approved')) {
            res.status(400).json({ message: error.message });
            return true;
        }
    }
    return false;
};
const getCart = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const cart = await cart_service_1.cartService.getCart(userId);
        res.json(formatCartResponse(cart));
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching cart');
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const validationResult = cart_validation_1.addToCartSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: validationResult.error.format()
            });
            return;
        }
        const { bookId, quantity } = validationResult.data;
        try {
            const cart = await cart_service_1.cartService.addToCart(userId, bookId, quantity);
            res.json(formatCartResponse(cart));
        }
        catch (error) {
            if (!handleCartError(error, res)) {
                (0, api_utils_1.handleError)(error, res, 'Error adding to cart');
            }
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error processing add to cart request');
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const paramsValidation = cart_validation_1.cartItemIdSchema.safeParse(req.params);
        const bodyValidation = cart_validation_1.updateCartSchema.safeParse(req.body);
        if (!paramsValidation.success) {
            res.status(400).json({
                message: 'Invalid cart item ID',
                errors: paramsValidation.error.format()
            });
            return;
        }
        if (!bodyValidation.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: bodyValidation.error.format()
            });
            return;
        }
        const { itemId } = paramsValidation.data;
        const { quantity } = bodyValidation.data;
        try {
            const cart = await cart_service_1.cartService.updateCartItem(userId, itemId, quantity);
            res.json(formatCartResponse(cart));
        }
        catch (error) {
            if (!handleCartError(error, res)) {
                (0, api_utils_1.handleError)(error, res, 'Error updating cart item');
            }
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error processing update cart request');
    }
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const paramsValidation = cart_validation_1.cartItemIdSchema.safeParse(req.params);
        if (!paramsValidation.success) {
            res.status(400).json({
                message: 'Invalid cart item ID',
                errors: paramsValidation.error.format()
            });
            return;
        }
        const { itemId } = paramsValidation.data;
        try {
            const cart = await cart_service_1.cartService.removeCartItem(userId, itemId);
            res.json(formatCartResponse(cart));
        }
        catch (error) {
            if (!handleCartError(error, res)) {
                (0, api_utils_1.handleError)(error, res, 'Error removing cart item');
            }
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error processing remove item request');
    }
};
exports.removeCartItem = removeCartItem;
const clearCart = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        await cart_service_1.cartService.clearCart(userId);
        res.json({
            items: [],
            total: 0,
            message: 'Cart cleared successfully'
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error clearing cart');
    }
};
exports.clearCart = clearCart;
const getCartItemCount = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const itemCount = await cart_service_1.cartService.getCartItemCount(userId);
        res.json({ itemCount });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching cart item count');
    }
};
exports.getCartItemCount = getCartItemCount;
//# sourceMappingURL=cart.controller.js.map