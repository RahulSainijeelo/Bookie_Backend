import prisma from '../lib/prisma';

export interface FavoriteQueryParams {
  page: number;
  limit: number;
  sortBy: string;
}

export const favoriteService = {
  async getUserFavorites(userId: string, params: FavoriteQueryParams) {
    const { page, limit, sortBy } = params;
    const skip = (page - 1) * limit;
    let favorites;
    if (sortBy === 'dateAdded') {
      favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      });
    } else {
      const orderByField = sortBy === 'title' ? 'title' : 
                        sortBy === 'author' ? 'author' : 
                        sortBy === 'price' ? 'price' : 'title';
      
      favorites = await prisma.favorite.findMany({
        where: { userId },
        include: {
          book: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          book: {
            [orderByField]: 'asc'
          }
        },
        skip,
        take: limit
      });
    }

    const total = await prisma.favorite.count({ where: { userId } });
    
    return { favorites, total };
  },
  formatFavoriteItem(favorite: any) {
    return {
      id: favorite.book.id,
      title: favorite.book.title,
      author: favorite.book.author,
      description: favorite.book.description,
      price: favorite.book.price,
      imageUrl: favorite.book.imageUrl,
      category: favorite.book.category,
      stock: favorite.book.stock,
      isApproved: favorite.book.isApproved,
      dateAdded: favorite.createdAt,
      favoriteId: favorite.id
    };
  },
  
  async addToFavorites(userId: string, bookId: string) {
    return await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: bookId }
      });
      
      if (!book) {
        throw new Error('Book not found');
      }
      
      if (!book.isApproved) {
        throw new Error('Book is not available');
      }
      const existingFavorite = await tx.favorite.findFirst({
        where: {
          userId,
          bookId
        }
      });
      
      if (existingFavorite) {
        throw new Error('Book already in favorites');
      }
      return await tx.favorite.create({
        data: {
          userId,
          bookId
        },
        include: {
          book: {
            include: {
              category: true
            }
          }
        }
      });
    });
  },
  async removeFromFavorites(userId: string, bookId: string) {
    return await prisma.$transaction(async (tx) => {
      const existingFavorite = await tx.favorite.findFirst({
        where: {
          userId,
          bookId
        }
      });
      if (!existingFavorite) {
        throw new Error('Favorite not found');
      }
      await tx.favorite.delete({
        where: { id: existingFavorite.id }
      });
      
      return true;
    });
  },

  async clearAllFavorites(userId: string) {
    const favoriteCount = await prisma.favorite.count({
      where: { userId }
    });
    
    if (favoriteCount === 0) {
      return { count: 0 };
    }
    
    const deleteResult = await prisma.favorite.deleteMany({
      where: { userId }
    });
    
    return { count: deleteResult.count };
  },
  
  async checkIsFavorite(userId: string, bookId: string) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId,
        bookId
      }
    });
    
    return {
      isFavorite: !!favorite,
      favoriteId: favorite?.id || null
    };
  },
  async getFavoritesCount(userId: string) {
    return await prisma.favorite.count({
      where: { userId }
    });
  }
};