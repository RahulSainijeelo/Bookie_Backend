import { OrderStatus } from '../generated/prisma';
import prisma from '../lib/prisma';
export interface OrderItem {
  bookId: string;
  quantity: number;
  price?: number; 
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod: string;
  couponCode?: string;
}

export interface OrderQueryParams {
  page: number;
  limit: number;
  status?: OrderStatus;
}

export const orderService = {
  async createOrder(userId: string, orderData: CreateOrderData) {
    const { items, shippingAddress, billingAddress, paymentMethod, couponCode } = orderData;
    const bookIds = items.map(item => item.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } }
    });
    if (books.length !== bookIds.length) {
      throw new Error('One or more books not found');
    }
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const book = books.find(b => b.id === item.bookId);
      
      if (!book) {
        throw new Error(`Book not found: ${item.bookId}`);
      }
      if ((book.stock || 0) < item.quantity) {
        throw new Error(`Not enough stock for book: ${book.title}`);
      }
      
      const itemTotal = book.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.price
      };
    });
    
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode }
      });
      
      if (coupon && coupon.isActive && coupon.expiryDate > new Date()) {
        totalAmount = totalAmount * (1 - coupon.discountPercentage / 100);
      } else if (coupon) {
        throw new Error('Coupon is expired or inactive');
      } else {
        throw new Error('Invalid coupon code');
      }
    }
    return await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          shippingAddress,
          billingAddress,
          paymentMethod,
          couponCode,
          totalAmount,
          status: 'PENDING',
          items: {
            create: orderItems
          }
        },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      });
      for (const item of items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }
      await tx.orderTracking.create({
        data: {
          orderId: newOrder.id,
          status: 'Order Placed',
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      });
      
      return newOrder;
    });
  },

  async getUserOrders(userId: string, params: OrderQueryParams) {
    const { page, limit, status } = params;
    const where: any = { userId };
    if (status) where.status = status;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              book: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
    ]);
    
    return { orders, total };
  },

  async getOrderById(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        items: {
          include: {
            book: true
          }
        },
        tracking: true
      }
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  },
  
  async cancelOrder(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        items: true
      }
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new Error(`Order cannot be cancelled in ${order.status} state`);
    }
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      });
      await tx.orderTracking.update({
        where: { orderId },
        data: {
          status: 'Order Cancelled',
          lastUpdated: new Date()
        }
      });
      for (const item of order.items) {
        await tx.book.update({
          where: { id: item.bookId },
          data: {
            stock: {
              increment: item.quantity
            }
          }
        });
      }
    });
    
    return { message: 'Order cancelled successfully' };
  },
  async getOrderTracking(userId: string, orderId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      select: { id: true }
    });
    
    if (!order) {
      throw new Error('Order not found');
    }
    const tracking = await prisma.orderTracking.findUnique({
      where: { orderId }
    });
    
    if (!tracking) {
      throw new Error('Tracking information not found');
    }
    
    return tracking;
  },
  async clearUserCart(userId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true }
    });
    
    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
    }
    return true;
  }
};