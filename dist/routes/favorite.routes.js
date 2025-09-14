"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favorite_controller_1 = require("../controllers/favorite.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, favorite_controller_1.getUserFavorites);
router.get('/count', auth_middleware_1.authenticate, favorite_controller_1.getFavoritesCount);
router.get('/check/:bookId', auth_middleware_1.authenticate, favorite_controller_1.checkIsFavorite);
router.post('/:bookId', auth_middleware_1.authenticate, favorite_controller_1.addToFavorites);
router.delete('/:bookId', auth_middleware_1.authenticate, favorite_controller_1.removeFromFavorites);
router.delete('/', auth_middleware_1.authenticate, favorite_controller_1.clearAllFavorites);
exports.default = router;
//# sourceMappingURL=favorite.routes.js.map