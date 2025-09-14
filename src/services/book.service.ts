import prisma from '../lib/prisma';

export const bookService = {
  async getAllBooks(params: any) {
    const {
      page,
      limit,
      categoryId,
      author,
      minPrice,
      maxPrice,
      rating,
      sortBy,
      sortOrder,
      search
    } = params;

    // Build where conditions for Prisma
    const where: any = {
      isApproved: true
    };
    
    if (categoryId) where.categoryId = categoryId;
    
    if (author) {
      where.author = {
        contains: author,
        mode: 'insensitive'
      };
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (rating !== undefined) {
      where.rating = { gte: rating };
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

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
        take: limit,
      }),
      prisma.book.count({ where })
    ]);

    return { books, total };
  },
  
  async getBookById(id: string) {
    return prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            reviews: true
          }
        }
      }
    });
  },
  
  async getBooksByCategory(categoryId: string, options: any) {
    const { page, limit, sortBy, sortOrder } = options;
    
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: {
          categoryId,
          isApproved: true
        },
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
      prisma.book.count({
        where: { 
          categoryId,
          isApproved: true
        }
      })
    ]);
    
    return { books, total };
  },
  
  async getBookReviews(bookId: string, page: number, limit: number) {
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { bookId },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ 
        where: { bookId }
      })
    ]);
    
    return { reviews, total };
  },
  
  async addBookReview(bookId: string, userId: string, data: any) {
    return prisma.$transaction(async (tx) => {
      // Check if book exists and is approved
      const book = await tx.book.findUnique({
        where: { id: bookId },
        select: { 
          id: true, 
          isApproved: true,
          sellerId: true,
          title: true
        }
      });
      
      if (!book || !book.isApproved) {
        throw new Error('Book not found');
      }
      
      // Prevent sellers from reviewing their own books
      if (book.sellerId === userId) {
        throw new Error('You cannot review your own book');
      }
      
      // Check if user has already reviewed this book
      const existingReview = await tx.review.findFirst({
        where: {
          bookId,
          userId
        }
      });
      
      if (existingReview) {
        throw new Error('You have already reviewed this book');
      }
      
      // Create review
      const review = await tx.review.create({
        data: {
          rating: data.rating,
          comment: data.comment,
          userId,
          bookId
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      // Update book average rating efficiently
      const avgRating = await tx.review.aggregate({
        where: { bookId },
        _avg: {
          rating: true
        }
      });
      
      await tx.book.update({
        where: { id: bookId },
        data: { 
          rating: avgRating._avg.rating || 0
        }
      });
      
      return { review, book };
    });
  },
  
  async getCategories() {
    return prisma.category.findMany({
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
      orderBy: {
        name: 'asc'
      }
    });
  },
  
  async getFeaturedBooks() {
    const [topRated, recent] = await Promise.all([
      prisma.book.findMany({
        where: {
          isApproved: true,
          rating: {
            gte: 4.0
          }
        },
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
          rating: 'desc'
        },
        take: 6
      }),
      prisma.book.findMany({
        where: {
          isApproved: true
        },
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 6
      })
    ]);
    
    return { topRated, recent };
  }
};