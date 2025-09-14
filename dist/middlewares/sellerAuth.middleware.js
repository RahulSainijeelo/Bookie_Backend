"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerAuth = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const sellerAuth = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        if (!user || user.role !== 'SELLER') {
            res.status(403).json({ message: 'Access denied: Seller role required' });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Seller auth middleware error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.sellerAuth = sellerAuth;
//# sourceMappingURL=sellerAuth.middleware.js.map