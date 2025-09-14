"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryById = exports.getBooksByCategoryId = exports.getAllCategories = void 0;
const category_service_1 = require("../services/category.service");
const category_validation_1 = require("../validations/category.validation");
const api_utils_1 = require("../utils/api.utils");
const formatCategory = (category) => ({
    id: category.id,
    name: category.name,
    bookCount: category._count?.books || 0,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
});
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
const getAllCategories = async (req, res) => {
    try {
        const categories = await category_service_1.categoryService.getAllCategories();
        const formattedCategories = categories.map(formatCategory);
        res.json({
            categories: formattedCategories,
            count: formattedCategories.length
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching categories');
    }
};
exports.getAllCategories = getAllCategories;
const getBooksByCategoryId = async (req, res) => {
    try {
        const params = validateParams(category_validation_1.categoryIdSchema, req.params, res);
        if (!params)
            return;
        const queryParams = validateParams(category_validation_1.categoryQuerySchema, req.query, res);
        if (!queryParams)
            return;
        const { id } = params;
        const [category, booksResult] = await Promise.all([
            category_service_1.categoryService.getCategoryById(id),
            category_service_1.categoryService.getBooksByCategory(id, queryParams)
        ]);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        const { books, total } = booksResult;
        res.json({
            category: formatCategory(category),
            books,
            ...(0, api_utils_1.createPaginationResponse)(books, queryParams.page, queryParams.limit, total)
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching books by category');
    }
};
exports.getBooksByCategoryId = getBooksByCategoryId;
const getCategoryById = async (req, res) => {
    try {
        const params = validateParams(category_validation_1.categoryIdSchema, req.params, res);
        if (!params)
            return;
        const { id } = params;
        const category = await category_service_1.categoryService.getCategoryById(id);
        if (!category) {
            res.status(404).json({ message: 'Category not found' });
            return;
        }
        res.json(formatCategory(category));
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching category');
    }
};
exports.getCategoryById = getCategoryById;
//# sourceMappingURL=categories.controller.js.map