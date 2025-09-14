"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.AuthenticationError = exports.ResourceNotFoundError = exports.EmailInUseError = void 0;
const prisma_1 = require("../generated/prisma");
const prisma_2 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
class EmailInUseError extends Error {
    constructor(message = 'Email is already in use') {
        super(message);
        this.name = 'EmailInUseError';
    }
}
exports.EmailInUseError = EmailInUseError;
class ResourceNotFoundError extends Error {
    constructor(resource = 'Resource') {
        super(`${resource} not found`);
        this.name = 'ResourceNotFoundError';
    }
}
exports.ResourceNotFoundError = ResourceNotFoundError;
class AuthenticationError extends Error {
    constructor(message = 'Authentication error') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
exports.userService = {
    async getUserProfile(userId) {
        const user = await prisma_2.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        addresses: true
                    }
                }
            }
        });
        if (!user) {
            throw new ResourceNotFoundError('User');
        }
        return user;
    },
    async updateUserProfile(userId, profileData) {
        try {
            return await prisma_2.default.$transaction(async (tx) => {
                if (profileData.email) {
                    const existingUser = await tx.user.findFirst({
                        where: {
                            email: profileData.email,
                            id: { not: userId }
                        }
                    });
                    if (existingUser) {
                        throw new EmailInUseError();
                    }
                }
                return await tx.user.update({
                    where: { id: userId },
                    data: profileData,
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });
            });
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ResourceNotFoundError('User');
            }
            throw error;
        }
    },
    async changePassword(userId, currentPassword, newPassword) {
        const user = await prisma_2.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                password: true
            }
        });
        if (!user) {
            throw new ResourceNotFoundError('User');
        }
        const isPasswordValid = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new AuthenticationError('Current password is incorrect');
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, BCRYPT_SALT_ROUNDS);
        await prisma_2.default.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                updatedAt: new Date()
            }
        });
        return { message: 'Password changed successfully' };
    },
    async getUserAddresses(userId) {
        return await prisma_2.default.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: 'desc' },
                { createdAt: 'desc' }
            ]
        });
    },
    async addUserAddress(userId, addressData) {
        return await prisma_2.default.$transaction(async (tx) => {
            const existingAddressCount = await tx.address.count({
                where: { userId }
            });
            const isFirstAddress = existingAddressCount === 0;
            const shouldBeDefault = addressData.isDefault || isFirstAddress;
            if (shouldBeDefault) {
                await tx.address.updateMany({
                    where: {
                        userId,
                        isDefault: true
                    },
                    data: { isDefault: false }
                });
            }
            return await tx.address.create({
                data: {
                    ...addressData,
                    isDefault: shouldBeDefault,
                    userId
                }
            });
        });
    },
    async updateUserAddress(userId, addressId, addressData) {
        try {
            return await prisma_2.default.$transaction(async (tx) => {
                const existingAddress = await tx.address.findFirst({
                    where: { id: addressId, userId }
                });
                if (!existingAddress) {
                    throw new ResourceNotFoundError('Address');
                }
                if (addressData.isDefault === true) {
                    await tx.address.updateMany({
                        where: {
                            userId,
                            isDefault: true,
                            id: { not: addressId }
                        },
                        data: { isDefault: false }
                    });
                }
                return await tx.address.update({
                    where: { id: addressId },
                    data: addressData
                });
            });
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ResourceNotFoundError('Address');
            }
            throw error;
        }
    },
    async deleteUserAddress(userId, addressId) {
        try {
            await prisma_2.default.$transaction(async (tx) => {
                const address = await tx.address.findFirst({
                    where: { id: addressId, userId }
                });
                if (!address) {
                    throw new ResourceNotFoundError('Address');
                }
                await tx.address.delete({
                    where: { id: addressId }
                });
                if (address.isDefault) {
                    const nextAddress = await tx.address.findFirst({
                        where: { userId },
                        orderBy: { createdAt: 'asc' }
                    });
                    if (nextAddress) {
                        await tx.address.update({
                            where: { id: nextAddress.id },
                            data: { isDefault: true }
                        });
                    }
                }
            });
            return { message: 'Address deleted successfully' };
        }
        catch (error) {
            if (error instanceof prisma_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new ResourceNotFoundError('Address');
            }
            throw error;
        }
    },
    async getDefaultAddress(userId) {
        const defaultAddress = await prisma_2.default.address.findFirst({
            where: {
                userId,
                isDefault: true
            }
        });
        if (!defaultAddress) {
            throw new ResourceNotFoundError('Default address');
        }
        return defaultAddress;
    }
};
//# sourceMappingURL=user.service.js.map