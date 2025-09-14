import prisma from '../lib/prisma';
export interface GetBooksByCategoryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const categoryService = {
  async getAllCategories() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: {
            books: {
              where: {
                isApproved: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  },
  async getCategoryById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            books: {
              where: {
                isApproved: true
              }
            }
          }
        }
      }
    });
  },
  async getBooksByCategory(categoryId: string, params: GetBooksByCategoryParams) {
    const { page, limit, sortBy, sortOrder } = params;
    const where = {
      categoryId,
      isApproved: true
    };
    
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              reviews: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.book.count({ where })
    ]);
    
    return { books, total };
  }
};