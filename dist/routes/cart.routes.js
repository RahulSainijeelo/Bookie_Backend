"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, cart_controller_1.getCart);
router.get('/count', auth_middleware_1.authenticate, cart_controller_1.getCartItemCount);
router.post('/', auth_middleware_1.authenticate, cart_controller_1.addToCart);
router.put('/:itemId', auth_middleware_1.authenticate, cart_controller_1.updateCartItem);
router.delete('/:itemId', auth_middleware_1.authenticate, cart_controller_1.removeCartItem);
router.delete('/', auth_middleware_1.authenticate, cart_controller_1.clearCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map