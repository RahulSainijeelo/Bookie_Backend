"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getProfile = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_validation_1 = require("../validations/auth.validation");
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
        const { name, email, password } = validationResult.data;
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
            }
        });
        const token = generateToken(user.id);
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
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
        const { email, password } = validationResult.data;
        const user = await prisma_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = generateToken(user.id);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
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
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getProfile = getProfile;
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getAllUsers = getAllUsers;
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
//# sourceMappingURL=auth.controller.js.map