"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultAddress = exports.deleteUserAddress = exports.updateUserAddress = exports.addUserAddress = exports.getUserAddresses = exports.changePassword = exports.updateUserProfile = exports.getUserProfile = void 0;
const user_validation_1 = require("../validations/user.validation");
const user_service_1 = require("../services/user.service");
const api_utils_1 = require("../utils/api.utils");
const user_utils_1 = require("../utils/user.utils");
const checkAuth = (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ message: 'User not authenticated' });
        return null;
    }
    return userId;
};
const validateData = (schema, data, res) => {
    const validation = schema.safeParse(data);
    if (!validation.success) {
        res.status(400).json({
            message: 'Validation error',
            errors: validation.error.format()
        });
        return null;
    }
    return validation.data;
};
const getUserProfile = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        try {
            const user = await user_service_1.userService.getUserProfile(userId);
            res.json(user);
        }
        catch (error) {
            if ((0, user_utils_1.handleUserError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching user profile');
    }
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const profileData = validateData(user_validation_1.updateProfileSchema, req.body, res);
        if (!profileData)
            return;
        if (Object.keys(profileData).length === 0) {
            res.status(400).json({ message: 'No data provided for update' });
            return;
        }
        try {
            const updatedUser = await user_service_1.userService.updateUserProfile(userId, profileData);
            res.json(updatedUser);
        }
        catch (error) {
            if ((0, user_utils_1.handleUserError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error updating user profile');
    }
};
exports.updateUserProfile = updateUserProfile;
const changePassword = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const passwordData = validateData(user_validation_1.changePasswordSchema, req.body, res);
        if (!passwordData)
            return;
        const { currentPassword, newPassword } = passwordData;
        if (currentPassword === newPassword) {
            res.status(400).json({ message: 'New password must be different from current password' });
            return;
        }
        try {
            const result = await user_service_1.userService.changePassword(userId, currentPassword, newPassword);
            res.json(result);
        }
        catch (error) {
            if ((0, user_utils_1.handleUserError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error changing password');
    }
};
exports.changePassword = changePassword;
const getUserAddresses = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const addresses = await user_service_1.userService.getUserAddresses(userId);
        res.json(addresses);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching user addresses');
    }
};
exports.getUserAddresses = getUserAddresses;
const addUserAddress = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const addressData = validateData(user_validation_1.addressSchema, req.body, res);
        if (!addressData)
            return;
        const newAddress = await user_service_1.userService.addUserAddress(userId, addressData);
        res.status(201).json(newAddress);
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error adding address');
    }
};
exports.addUserAddress = addUserAddress;
const updateUserAddress = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateData(user_validation_1.addressIdSchema, req.params, res);
        if (!params)
            return;
        const addressData = validateData(user_validation_1.addressSchema.partial(), req.body, res);
        if (!addressData)
            return;
        if (Object.keys(addressData).length === 0) {
            res.status(400).json({ message: 'No data provided for update' });
            return;
        }
        try {
            const updatedAddress = await user_service_1.userService.updateUserAddress(userId, params.id, addressData);
            res.json(updatedAddress);
        }
        catch (error) {
            if ((0, user_utils_1.handleUserError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error updating address');
    }
};
exports.updateUserAddress = updateUserAddress;
const deleteUserAddress = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        const params = validateData(user_validation_1.addressIdSchema, req.params, res);
        if (!params)
            return;
        try {
            const result = await user_service_1.userService.deleteUserAddress(userId, params.id);
            res.json(result);
        }
        catch (error) {
            if ((0, user_utils_1.handleUserError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error deleting address');
    }
};
exports.deleteUserAddress = deleteUserAddress;
const getDefaultAddress = async (req, res) => {
    try {
        const userId = checkAuth(req, res);
        if (!userId)
            return;
        try {
            const defaultAddress = await user_service_1.userService.getDefaultAddress(userId);
            res.json(defaultAddress);
        }
        catch (error) {
            if ((0, user_utils_1.handleUserError)(error, res))
                return;
            throw error;
        }
    }
    catch (error) {
        (0, api_utils_1.handleError)(error, res, 'Error fetching default address');
    }
};
exports.getDefaultAddress = getDefaultAddress;
//# sourceMappingURL=user.controller.js.map