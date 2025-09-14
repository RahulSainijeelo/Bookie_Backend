"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/profile', auth_middleware_1.authenticate, user_controller_1.getUserProfile);
router.put('/profile', auth_middleware_1.authenticate, user_controller_1.updateUserProfile);
router.put('/change-password', auth_middleware_1.authenticate, user_controller_1.changePassword);
router.get('/addresses', auth_middleware_1.authenticate, user_controller_1.getUserAddresses);
router.post('/addresses', auth_middleware_1.authenticate, user_controller_1.addUserAddress);
router.put('/addresses/:id', auth_middleware_1.authenticate, user_controller_1.updateUserAddress);
router.delete('/addresses/:id', auth_middleware_1.authenticate, user_controller_1.deleteUserAddress);
router.get('/addresses/default', auth_middleware_1.authenticate, user_controller_1.getDefaultAddress);
exports.default = router;
//# sourceMappingURL=user.routes.js.map