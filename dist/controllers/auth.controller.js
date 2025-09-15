"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.getAllUsers = exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_validation_1 = require("../validations/auth.validation");
const api_utils_1 = require("../utils/api.utils");
const register = async (req, res) => {
    try {
        const validationResult = auth_validation_1.registerSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: validationResult.error.format()
            });
            return;
        }
        const { name, email, password, role } = validationResult.data;
        const userExists = await prisma_1.default.user.findUnique({
            where: { email }
        });
        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });
        const token = generateToken(user.id, user.role);
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error during registration');
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const validationResult = auth_validation_1.loginSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                message: 'Validation error',
                errors: validationResult.error.format()
            });
            return;
        }
        const { email, password, role } = validationResult.data;
        const user = await prisma_1.default.user.findFirst({
            where: {
                email,
                role
            }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials or role' });
            return;
        }
        const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user.id, user.role);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error during login');
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching user profile');
    }
};
exports.getProfile = getProfile;
const getAllUsers = async (req, res) => {
    try {
        const userRole = req.user?.role;
        if (userRole !== 'ADMIN') {
            res.status(403).json({ message: 'Not authorized to access this resource' });
            return;
        }
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(users);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching users');
    }
};
exports.getAllUsers = getAllUsers;
const refreshToken = async (req, res) => {
    try {
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId || !userRole) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const token = generateToken(userId, userRole);
        res.json({ token });
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error refreshing token');
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    res.json({ message: 'Logout successful' });
};
exports.logout = logout;
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
//# sourceMappingURL=auth.controller.js.map