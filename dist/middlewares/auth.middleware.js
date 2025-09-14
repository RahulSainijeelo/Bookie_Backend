"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Not authorized, no token' });
            return;
        }
        const authParts = req.headers.authorization.split(' ');
        if (authParts.length !== 2) {
            res.status(401).json({ message: 'Invalid authorization format' });
            return;
        }
        const token = authParts[1];
        if (!token) {
            res.status(401).json({ message: 'Not authorized, no token' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === 'object' && decoded && 'id' in decoded) {
            req.user = { id: decoded.id };
            next();
        }
        else {
            res.status(401).json({ message: 'Invalid token payload' });
            return;
        }
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
        return;
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.middleware.js.map