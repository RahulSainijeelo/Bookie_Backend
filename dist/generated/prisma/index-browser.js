"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime, skip } = require('./runtime/index-browser.js');
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
Prisma.prismaVersion = {
    client: "6.16.1",
    engine: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43"
};
Prisma.PrismaClientKnownRequestError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;
Prisma.sql = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;
Prisma.getExtensionContext = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
    const runtimeName = getRuntime().prettyName;
    throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;
Prisma.NullTypes = {
    DbNull: objectEnumValues.classes.DbNull,
    JsonNull: objectEnumValues.classes.JsonNull,
    AnyNull: objectEnumValues.classes.AnyNull
};
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.Prisma.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    password: 'password',
    name: 'name',
    profilePic: 'profilePic',
    role: 'role',
    isActive: 'isActive',
    isVerified: 'isVerified',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.AddressScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    name: 'name',
    street: 'street',
    city: 'city',
    state: 'state',
    postalCode: 'postalCode',
    country: 'country',
    phone: 'phone',
    isDefault: 'isDefault',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CategoryScalarFieldEnum = {
    id: 'id',
    name: 'name'
};
exports.Prisma.BookScalarFieldEnum = {
    id: 'id',
    title: 'title',
    author: 'author',
    description: 'description',
    isApproved: 'isApproved',
    price: 'price',
    categoryId: 'categoryId',
    imageUrl: 'imageUrl',
    rating: 'rating',
    sellerId: 'sellerId',
    stock: 'stock',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.OrderScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    status: 'status',
    shippingAddress: 'shippingAddress',
    billingAddress: 'billingAddress',
    paymentMethod: 'paymentMethod',
    couponCode: 'couponCode',
    totalAmount: 'totalAmount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.OrderItemScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    bookId: 'bookId',
    quantity: 'quantity',
    price: 'price'
};
exports.Prisma.OrderTrackingScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    status: 'status',
    carrier: 'carrier',
    trackingNumber: 'trackingNumber',
    estimatedDelivery: 'estimatedDelivery',
    lastUpdated: 'lastUpdated'
};
exports.Prisma.CouponScalarFieldEnum = {
    id: 'id',
    code: 'code',
    discountPercentage: 'discountPercentage',
    isActive: 'isActive',
    expiryDate: 'expiryDate',
    createdAt: 'createdAt'
};
exports.Prisma.FavoriteScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    bookId: 'bookId',
    createdAt: 'createdAt'
};
exports.Prisma.ReviewScalarFieldEnum = {
    id: 'id',
    rating: 'rating',
    comment: 'comment',
    userId: 'userId',
    bookId: 'bookId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CartScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.CartItemScalarFieldEnum = {
    id: 'id',
    cartId: 'cartId',
    bookId: 'bookId',
    quantity: 'quantity',
    price: 'price',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.Prisma.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.Prisma.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.Prisma.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.Role = exports.$Enums.Role = {
    USER: 'USER',
    ADMIN: 'ADMIN',
    SELLER: 'SELLER',
    MODERATOR: 'MODERATOR'
};
exports.OrderStatus = exports.$Enums.OrderStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED'
};
exports.Prisma.ModelName = {
    User: 'User',
    Address: 'Address',
    Category: 'Category',
    Book: 'Book',
    Order: 'Order',
    OrderItem: 'OrderItem',
    OrderTracking: 'OrderTracking',
    Coupon: 'Coupon',
    Favorite: 'Favorite',
    Review: 'Review',
    Cart: 'Cart',
    CartItem: 'CartItem'
};
class PrismaClient {
    constructor() {
        return new Proxy(this, {
            get(target, prop) {
                let message;
                const runtime = getRuntime();
                if (runtime.isEdge) {
                    message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
                }
                else {
                    message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).';
                }
                message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;
                throw new Error(message);
            }
        });
    }
}
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
//# sourceMappingURL=index-browser.js.map