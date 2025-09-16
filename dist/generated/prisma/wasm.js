"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientRustPanicError, PrismaClientInitializationError, PrismaClientValidationError, getPrismaClient, sqltag, empty, join, raw, skip, Decimal, Debug, objectEnumValues, makeStrictEnum, Extensions, warnOnce, defineDmmfProperty, Public, getRuntime, createParam, } = require('./runtime/wasm-engine-edge.js');
const Prisma = {};
exports.Prisma = Prisma;
exports.$Enums = {};
Prisma.prismaVersion = {
    client: "6.16.1",
    engine: "1c57fdcd7e44b29b9313256c76699e91c3ac3c43"
};
Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError;
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError;
Prisma.PrismaClientInitializationError = PrismaClientInitializationError;
Prisma.PrismaClientValidationError = PrismaClientValidationError;
Prisma.Decimal = Decimal;
Prisma.sql = sqltag;
Prisma.empty = empty;
Prisma.join = join;
Prisma.raw = raw;
Prisma.validator = Public.validator;
Prisma.getExtensionContext = Extensions.getExtensionContext;
Prisma.defineExtension = Extensions.defineExtension;
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
const config = {
    "generator": {
        "name": "client",
        "provider": {
            "fromEnvVar": null,
            "value": "prisma-client-js"
        },
        "output": {
            "value": "/home/antaryah/practice/Bookie_Backend/src/generated/prisma",
            "fromEnvVar": null
        },
        "config": {
            "engineType": "library"
        },
        "binaryTargets": [
            {
                "fromEnvVar": null,
                "value": "debian-openssl-3.0.x",
                "native": true
            }
        ],
        "previewFeatures": [],
        "sourceFilePath": "/home/antaryah/practice/Bookie_Backend/prisma/schema.prisma",
        "isCustomOutput": true
    },
    "relativeEnvPaths": {
        "rootEnvPath": null,
        "schemaEnvPath": "../../../.env"
    },
    "relativePath": "../../../prisma",
    "clientVersion": "6.16.1",
    "engineVersion": "1c57fdcd7e44b29b9313256c76699e91c3ac3c43",
    "datasourceNames": [
        "db"
    ],
    "activeProvider": "postgresql",
    "postinstall": false,
    "inlineDatasources": {
        "db": {
            "url": {
                "fromEnvVar": "DATABASE_URL",
                "value": null
            }
        }
    },
    "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"../src/generated/prisma\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel User {\n  id         String     @id @default(cuid())\n  email      String     @unique\n  password   String\n  name       String\n  profilePic String?\n  role       Role       @default(USER)\n  addresses  Address[]\n  isActive   Boolean    @default(true)\n  isVerified Boolean    @default(false)\n  createdAt  DateTime   @default(now())\n  updatedAt  DateTime   @updatedAt\n  cart       Cart?\n  books      Book[]\n  orders     Order[]\n  reviews    Review[]\n  favorites  Favorite[]\n\n  @@map(\"users\")\n}\n\nmodel Address {\n  id         String   @id @default(uuid())\n  userId     String\n  user       User     @relation(fields: [userId], references: [id])\n  name       String\n  street     String\n  city       String\n  state      String\n  postalCode String\n  country    String\n  phone      String?\n  isDefault  Boolean  @default(false)\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n}\n\nmodel Category {\n  id    String @id @default(uuid())\n  name  String @unique\n  books Book[]\n}\n\nmodel Book {\n  id          String      @id @default(uuid())\n  title       String\n  author      String\n  description String?\n  isApproved  Boolean     @default(true)\n  price       Float\n  categoryId  String\n  category    Category    @relation(fields: [categoryId], references: [id])\n  imageUrl    String?\n  rating      Float       @default(0)\n  reviews     Review[]\n  sellerId    String\n  stock       Int         @default(0)\n  orderItems  OrderItem[]\n  favorites   Favorite[]\n  seller      User        @relation(fields: [sellerId], references: [id])\n  createdAt   DateTime    @default(now())\n  updatedAt   DateTime    @updatedAt\n  CartItem    CartItem[]\n}\n\nmodel Order {\n  id              String         @id @default(uuid())\n  userId          String\n  user            User           @relation(fields: [userId], references: [id])\n  items           OrderItem[]\n  status          OrderStatus    @default(PENDING)\n  shippingAddress String\n  billingAddress  String?\n  paymentMethod   String\n  couponCode      String?\n  totalAmount     Float\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n  tracking        OrderTracking?\n}\n\nmodel OrderItem {\n  id       String @id @default(uuid())\n  orderId  String\n  order    Order  @relation(fields: [orderId], references: [id])\n  bookId   String\n  book     Book   @relation(fields: [bookId], references: [id])\n  quantity Int\n  price    Float\n}\n\nmodel OrderTracking {\n  id                String    @id @default(uuid())\n  orderId           String    @unique\n  order             Order     @relation(fields: [orderId], references: [id])\n  status            String\n  carrier           String?\n  trackingNumber    String?\n  estimatedDelivery DateTime?\n  lastUpdated       DateTime  @default(now())\n}\n\nmodel Coupon {\n  id                 String   @id @default(uuid())\n  code               String   @unique\n  discountPercentage Float\n  isActive           Boolean  @default(true)\n  expiryDate         DateTime\n  createdAt          DateTime @default(now())\n}\n\nmodel Favorite {\n  id        String   @id @default(uuid())\n  userId    String\n  user      User     @relation(fields: [userId], references: [id])\n  bookId    String\n  book      Book     @relation(fields: [bookId], references: [id])\n  createdAt DateTime @default(now())\n\n  @@unique([userId, bookId])\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  rating    Int\n  comment   String\n  userId    String\n  user      User     @relation(fields: [userId], references: [id])\n  bookId    String\n  book      Book     @relation(fields: [bookId], references: [id])\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Cart {\n  id        String     @id @default(uuid())\n  userId    String     @unique\n  user      User       @relation(fields: [userId], references: [id])\n  items     CartItem[]\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n}\n\nmodel CartItem {\n  id        String   @id @default(uuid())\n  cartId    String\n  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)\n  bookId    String\n  book      Book     @relation(fields: [bookId], references: [id])\n  quantity  Int\n  price     Float\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum Role {\n  USER\n  ADMIN\n  SELLER\n  MODERATOR\n}\n\nenum OrderStatus {\n  PENDING\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n",
    "inlineSchemaHash": "68624c711960894d271d4fd8d9398c8b8947139e5aee2e10d3ff37737d61c6d3",
    "copyEngine": true
};
config.dirname = '/';
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"password\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"profilePic\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"addresses\",\"kind\":\"object\",\"type\":\"Address\",\"relationName\":\"AddressToUser\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"isVerified\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"cart\",\"kind\":\"object\",\"type\":\"Cart\",\"relationName\":\"CartToUser\"},{\"name\":\"books\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToUser\"},{\"name\":\"orders\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToUser\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"ReviewToUser\"},{\"name\":\"favorites\",\"kind\":\"object\",\"type\":\"Favorite\",\"relationName\":\"FavoriteToUser\"}],\"dbName\":\"users\"},\"Address\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AddressToUser\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"street\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"state\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"postalCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"country\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"phone\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isDefault\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Category\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"books\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToCategory\"}],\"dbName\":null},\"Book\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"author\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isApproved\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"categoryId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"category\",\"kind\":\"object\",\"type\":\"Category\",\"relationName\":\"BookToCategory\"},{\"name\":\"imageUrl\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"Review\",\"relationName\":\"BookToReview\"},{\"name\":\"sellerId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stock\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"orderItems\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"BookToOrderItem\"},{\"name\":\"favorites\",\"kind\":\"object\",\"type\":\"Favorite\",\"relationName\":\"BookToFavorite\"},{\"name\":\"seller\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BookToUser\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"CartItem\",\"kind\":\"object\",\"type\":\"CartItem\",\"relationName\":\"BookToCartItem\"}],\"dbName\":null},\"Order\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"OrderToUser\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"OrderItem\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"OrderStatus\"},{\"name\":\"shippingAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"billingAddress\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"paymentMethod\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"couponCode\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"tracking\",\"kind\":\"object\",\"type\":\"OrderTracking\",\"relationName\":\"OrderToOrderTracking\"}],\"dbName\":null},\"OrderItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToOrderItem\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToOrderItem\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"}],\"dbName\":null},\"OrderTracking\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"orderId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"order\",\"kind\":\"object\",\"type\":\"Order\",\"relationName\":\"OrderToOrderTracking\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"carrier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"trackingNumber\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"estimatedDelivery\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"lastUpdated\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Coupon\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"discountPercentage\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"isActive\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"expiryDate\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Favorite\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"FavoriteToUser\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToFavorite\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Review\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ReviewToUser\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToReview\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"Cart\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CartToUser\"},{\"name\":\"items\",\"kind\":\"object\",\"type\":\"CartItem\",\"relationName\":\"CartToCartItem\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"CartItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cartId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"cart\",\"kind\":\"object\",\"type\":\"Cart\",\"relationName\":\"CartToCartItem\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToCartItem\"},{\"name\":\"quantity\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"price\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
defineDmmfProperty(exports.Prisma, config.runtimeDataModel);
config.engineWasm = {
    getRuntime: async () => require('./query_engine_bg.js'),
    getQueryEngineWasmModule: async () => {
        const loader = (await Promise.resolve().then(() => __importStar(require('#wasm-engine-loader')))).default;
        const engine = (await loader).default;
        return engine;
    }
};
config.compilerWasm = undefined;
config.injectableEdgeEnv = () => ({
    parsed: {
        DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
    }
});
if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
    Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined);
}
const PrismaClient = getPrismaClient(config);
exports.PrismaClient = PrismaClient;
Object.assign(exports, Prisma);
//# sourceMappingURL=wasm.js.map