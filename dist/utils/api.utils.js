"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationResponse = exports.handleError = void 0;
const handleError = (error, res, message = 'Server error') => {
    console.error(`${message}:`, error);
    res.status(500).json({
        message,
        ...(process.env.NODE_ENV === 'development' && {
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    });
};
exports.handleError = handleError;
const createPaginationResponse = (items, page, limit, total) => {
    return {
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            limit,
            total
        }
    };
};
exports.createPaginationResponse = createPaginationResponse;
//# sourceMappingURL=api.utils.js.map