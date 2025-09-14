"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, order_controller_1.createOrder);
router.get('/', auth_middleware_1.authenticate, order_controller_1.getUserOrders);
router.get('/:id', auth_middleware_1.authenticate, order_controller_1.getOrderById);
router.put('/:id/cancel', auth_middleware_1.authenticate, order_controller_1.cancelOrder);
router.get('/:id/track', auth_middleware_1.authenticate, order_controller_1.getOrderTracking);
exports.default = router;
//# sourceMappingURL=order.routes.js.map