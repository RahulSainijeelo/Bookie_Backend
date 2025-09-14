import { OrderStatus,Role } from '../generated/prisma';
import prisma from '../lib/prisma';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface BookData {
  title: string;
  author: string;
  description?: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl?: string | null;
}

export const sellerService = {
  async getSellerDashboard(sellerId: string) {
    const [booksCount, pendingOrdersCount, revenue, recentOrders] = await Promise.all([
      prisma.book.count({ where: { sellerId } }),
      prisma.order.count({ 
        where: { 
          items: {
            some: {
              book: {
                sellerId
              }
            }
          },
          status: 'PENDING'
        } 
      }),
      prisma.order.aggregate({
        where: {
          items: {
            some: {
              book: {
                sellerId
              }
            }
          },
          status: 'DELIVERED'
        },
        _sum: { totalAmount: true }
      }),
      prisma.order.findMany({
        where: { 
          items: {
            some: {
              book: {
                sellerId
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              book: true
            }
          }
        }
      })
    ]);
    
    return {
      stats: {
        booksCount,
        pendingOrdersCount,
        revenue: revenue._sum?.totalAmount || 0
      },
      recentOrders
    };
  },
  async getAllUsers(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count()
    ]);
    
    return {
      users,
      total
    };
  },
  

  async updateUserRole(userId: string, role: Role) { 
    return await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
  },

  async getAllBooks(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.book.count()
    ]);
    
    return {
      books,
      total
    };
  },

  async approveBook(bookId: string) {
    return await prisma.book.update({
      where: { id: bookId },
      data: { isApproved: true },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },
 
  async getAllOrders(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              book: {
                include: {
                  seller: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.order.count()
    ]);
    
    return {
      orders,
      total
    };
  },
  async getAnalytics() {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear + 1, 0, 1);
    
    const monthlySalesRaw = await prisma.$queryRaw<Array<{ month: string; revenue: number }>>`
      SELECT 
        DATE_FORMAT(createdAt, '%Y-%m') as month,
        COALESCE(SUM(totalAmount), 0) as revenue
      FROM \`Order\`
      WHERE 
        createdAt >= ${startOfYear}
        AND createdAt < ${endOfYear}
        AND status = 'DELIVERED'
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
      ORDER BY month ASC
    `;
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, '0');
      return `${currentYear}-${month}`;
    });
    
    const monthlySales = allMonths.map(month => {
      const found = monthlySalesRaw.find(item => item.month === month);
      return {
        month,
        revenue: found ? Number(found.revenue) : 0
      };
    });
    const topSellingBooksRaw = await prisma.orderItem.groupBy({
      by: ['bookId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });
    
    const bookIds = topSellingBooksRaw.map(item => item.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    const topSellingBooks = topSellingBooksRaw.map(item => {
      const book = books.find(b => b.id === item.bookId);
      return book ? {
        ...book,
        totalSold: item._sum.quantity || 0
      } : null;
    }).filter(Boolean);
    const categoryDistributionRaw = await prisma.book.groupBy({
      by: ['categoryId'],
      _count: {
        id: true
      }
    });
    
    const categoryIds = categoryDistributionRaw.map(item => item.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } }
    });
    
    const categoryDistribution = categoryDistributionRaw.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        categoryId: item.categoryId,
        categoryName: category?.name || 'Unknown',
        count: item._count.id
      };
    });
    
    return {
      monthlySales,
      topSellingBooks,
      categoryDistribution
    };
  },
  async addBook(sellerId: string, bookData: BookData) {
    return await prisma.book.create({
      data: {
        ...bookData,
        sellerId,
        isApproved: false 
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  },

  async validateCategoryExists(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    return !!category;
  },

  async updateBook(bookId: string, sellerId: string, bookData: Partial<BookData>) {
    return await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: bookId }
      });
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (book.sellerId !== sellerId) {
        throw new Error('Access denied: You do not own this book');
      }
      
      return await tx.book.update({
        where: { id: bookId },
        data: bookData,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    });
  },

  async deleteBook(bookId: string, sellerId: string) {
    return await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: bookId }
      });
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (book.sellerId !== sellerId) {
        throw new Error('Access denied: You do not own this book');
      }
      const orderItemsCount = await tx.orderItem.count({
        where: { bookId }
      });
      
      if (orderItemsCount > 0) {
        throw new Error('Cannot delete book: It has associated orders');
      }
      
      await tx.book.delete({
        where: { id: bookId }
      });
      
      return { message: 'Book deleted successfully' };
    });
  },

  async updateOrderStatus(orderId: string, sellerId: string, status: OrderStatus) { // Fixed: Use OrderStatus type
    return await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              book: true
            }
          }
        }
      });
      
      if (!order) {
        throw new Error('Order not found');
      }
      const sellerOwnsBook = order.items.some(item => item.book.sellerId === sellerId);
      if (!sellerOwnsBook) {
        throw new Error('Access denied: You do not own any books in this order');
      }
      
      return await tx.order.update({
        where: { id: orderId },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          items: {
            include: {
              book: true
            }
          }
        }
      });
    });
  }
};