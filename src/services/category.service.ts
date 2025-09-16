import prisma from '../lib/prisma';

export interface GetBooksByCategoryParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CreateCategoryData {
  name: string;
}

export class CategoryExistsError extends Error {
  constructor(message: string = 'Category already exists') {
    super(message);
    this.name = 'CategoryExistsError';
  }
}

export const categoryService = {
  /**
   * Get all categories with book counts
   */
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
  
  /**
   * Get a specific category by ID
   */
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
  
  /**
   * Get books by category with pagination
   */
  async getBooksByCategory(categoryId: string, params: GetBooksByCategoryParams) {
    const { page, limit, sortBy, sortOrder } = params;
    
    // Only return approved books
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
  },

  /**
   * Create a new category
   */
  async createCategory(categoryData: CreateCategoryData) {
    const { name } = categoryData;
    
    // Check if category already exists (case-insensitive)
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });
    
    if (existingCategory) {
      throw new CategoryExistsError(`Category '${name}' already exists`);
    }
    
    // Create the new category
    return await prisma.category.create({
      data: {
        name: name.trim()
      },
      include: {
        _count: {
          select: {
            books: true
          }
        }
      }
    });
  }
};