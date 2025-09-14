"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOrderError = void 0;
const handleOrderError = (error, res) => {
    if (error instanceof Error) {
        const message = error.message;
        if (message === 'Order not found' || message === 'Tracking information not found') {
            res.status(404).json({ message });
            return true;
        }
        if (message.startsWith('Not enough stock') || message === 'One or more books not found') {
            res.status(400).json({ message });
            return true;
        }
        if (message.startsWith('Order cannot be cancelled')) {
            res.status(400).json({ message });
            return true;
        }
        if (message === 'Invalid coupon code' || message === 'Coupon is expired or inactive') {
            res.status(400).json({ message });
            return true;
        }
    }
    return false;
};
exports.handleOrderError = handleOrderError;
//# sourceMappingURL=order.utils.js.map