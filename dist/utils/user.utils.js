"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUserError = void 0;
const user_service_1 = require("../services/user.service");
const handleUserError = (error, res) => {
    if (error instanceof user_service_1.EmailInUseError) {
        res.status(400).json({ message: error.message });
        return true;
    }
    if (error instanceof user_service_1.ResourceNotFoundError) {
        res.status(404).json({ message: error.message });
        return true;
    }
    if (error instanceof user_service_1.AuthenticationError) {
        res.status(401).json({ message: error.message });
        return true;
    }
    return false;
};
exports.handleUserError = handleUserError;
//# sourceMappingURL=user.utils.js.map