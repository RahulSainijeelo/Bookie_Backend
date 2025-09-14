"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/', book_controller_1.getAllBooks);
router.get('/search', book_controller_1.searchBooks);
router.get('/category/:category', book_controller_1.getBooksByCategory);
router.get('/:id', book_controller_1.getBookById);
router.get('/:id/reviews', book_controller_1.getBookReviews);
router.post('/:id/reviews', auth_middleware_1.authenticate, book_controller_1.addBookReview);
exports.default = router;
//# sourceMappingURL=book.routes.js.map