"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavoritesCount = exports.checkIsFavorite = exports.clearAllFavorites = exports.removeFromFavorites = exports.addToFavorites = exports.getUserFavorites = void 0;
const favorite_service_1 = require("../services/favorite.service");
const favorite_validation_1 = require("../validations/favorite.validation");
const api_utils_1 = require("../utils/api.utils");
const favorite_utils_1 = require("../utils/favorite.utils");
const checkAuth = (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return null;
    }
    return userId;
};
const validateParams = (schema, data, res) => {
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
const getUserFavorites = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateParams(favorite_validation_1.favoriteQuerySchema, req.query, res);
        if (!params)
            return;
        const { favorites, total } = await favorite_service_1.favoriteService.getUserFavorites(userId, params);
        const formattedFavorites = favorites.map(favorite_service_1.favoriteService.formatFavoriteItem);
        res.json({
            favorites: formattedFavorites,
            pagination: {
                currentPage: params.page,
                totalPages: Math.ceil(total / params.limit),
                limit: params.limit,
                total
            }
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching favorites');
    }
};
exports.getUserFavorites = getUserFavorites;
const addToFavorites = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateParams(favorite_validation_1.bookIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const favorite = await favorite_service_1.favoriteService.addToFavorites(userId, params.bookId);
            const formattedFavorite = favorite_service_1.favoriteService.formatFavoriteItem(favorite);
            res.status(201).json({
                message: 'Book added to favorites',
                favorite: formattedFavorite
            });
        }
        catch (error) {
            if ((0, favorite_utils_1.handleFavoriteError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error adding to favorites');
    }
};
exports.addToFavorites = addToFavorites;
const removeFromFavorites = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateParams(favorite_validation_1.bookIdSchema, req.params, res);
        if (!params)
            return;
        try {
            await favorite_service_1.favoriteService.removeFromFavorites(userId, params.bookId);
            res.json({ message: 'Book removed from favorites' });
        }
        catch (error) {
            if ((0, favorite_utils_1.handleFavoriteError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error removing from favorites');
    }
};
exports.removeFromFavorites = removeFromFavorites;
const clearAllFavorites = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const result = await favorite_service_1.favoriteService.clearAllFavorites(userId);
        if (result.count === 0) {
            res.json({
                message: 'No favorites to clear',
                deletedCount: 0
            });
        }
        else {
            res.json({
                message: 'All favorites cleared successfully',
                deletedCount: result.count
            });
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error clearing favorites');
    }
};
exports.clearAllFavorites = clearAllFavorites;
const checkIsFavorite = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateParams(favorite_validation_1.bookIdSchema, req.params, res);
        if (!params)
            return;
        const result = await favorite_service_1.favoriteService.checkIsFavorite(userId, params.bookId);
        res.json(result);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error checking favorite status');
    }
};
exports.checkIsFavorite = checkIsFavorite;
const getFavoritesCount = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const count = await favorite_service_1.favoriteService.getFavoritesCount(userId);
        res.json({ count });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching favorites count');
    }
};
exports.getFavoritesCount = getFavoritesCount;
//# sourceMappingURL=favorite.controller.js.map