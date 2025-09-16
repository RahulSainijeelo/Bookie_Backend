"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCategoryError = void 0;
const category_service_1 = require("../services/category.service");
const handleCategoryError = (error, res) => {
    if (error instanceof category_service_1.CategoryExistsError) {
        res.status(400).json({ message: error.message });
        return true;
    }
    return false;
};
exports.handleCategoryError = handleCategoryError;
//# sourceMappingURL=category.utils.js.map