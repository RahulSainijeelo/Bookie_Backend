"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seller_controller_1 = require("../controllers/seller.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/dashboard', auth_middleware_1.authenticate, seller_controller_1.getSellerDashboard);
router.get('/users', auth_middleware_1.authenticate, seller_controller_1.getAllUsers);
router.put('/users/:id/role', auth_middleware_1.authenticate, seller_controller_1.updateUserRole);
router.get('/books', auth_middleware_1.authenticate, seller_controller_1.getAllBooksSeller);
router.post('/books', auth_middleware_1.authenticate, seller_controller_1.addBook);
router.put('/books/:id', auth_middleware_1.authenticate, seller_controller_1.updateBook);
router.delete('/books/:id', auth_middleware_1.authenticate, seller_controller_1.deleteBook);
router.put('/books/:id/approve', auth_middleware_1.authenticate, seller_controller_1.approveBook);
router.get('/orders', auth_middleware_1.authenticate, seller_controller_1.getAllOrders);
router.put('/orders/:id/status', auth_middleware_1.authenticate, seller_controller_1.updateOrderStatus);
router.get('/analytics', auth_middleware_1.authenticate, seller_controller_1.getAnalytics);
exports.default = router;
//# sourceMappingURL=seller.routes.js.map