"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categories_controller_1 = require("../controllers/categories.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/', categories_controller_1.getAllCategories);
router.get('/:id', categories_controller_1.getCategoryById);
router.get('/:id/books', categories_controller_1.getBooksByCategoryId);
router.post('/', auth_middleware_1.authenticate, categories_controller_1.createCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map