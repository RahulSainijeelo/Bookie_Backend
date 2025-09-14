import { Request, Response } from 'express';
import { favoriteService } from '../services/favorite.service';
import { favoriteQuerySchema, bookIdSchema } from '../validations/favorite.validation';
import { handleError } from '../utils/api.utils';
import { handleFavoriteError } from '../utils/favorite.utils';

const checkAuth = (req: Request, res: Response): string | null => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return null;
  }
  return userId;
};

const validateParams = (schema: any, data: any, res: Response): any | null => {
  const validation = schema.safeParse(data);
  
  if (!validation.success) {
    res.status(400).json({ 
      message: 'Validation error', 
      errors: validation.error.format() 
    });
    return null;
  }
  
  return validation.data;
};

export const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateParams(favoriteQuerySchema, req.query, res);
    if (!params) return;
    const { favorites, total } = await favoriteService.getUserFavorites(userId, params);
    const formattedFavorites = favorites.map(favoriteService.formatFavoriteItem);
    
    res.json({
      favorites: formattedFavorites,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(total / params.limit),
        limit: params.limit,
        total
      }
    });
  } catch (error) {
    handleError(error, res, 'Error fetching favorites');
  }
};

export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const params = validateParams(bookIdSchema, req.params, res);
    if (!params) return;
    
    try {
      const favorite = await favoriteService.addToFavorites(userId, params.bookId);
      const formattedFavorite = favoriteService.formatFavoriteItem(favorite);
      
      res.status(201).json({ 
        message: 'Book added to favorites',
        favorite: formattedFavorite
      });
    } catch (error) {
      if (handleFavoriteError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error adding to favorites');
  }
};

export const removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateParams(bookIdSchema, req.params, res);
    if (!params) return;
    
    try {
      await favoriteService.removeFromFavorites(userId, params.bookId);
      res.json({ message: 'Book removed from favorites' });
    } catch (error) {
      if (handleFavoriteError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error removing from favorites');
  }
};

export const clearAllFavorites = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const result = await favoriteService.clearAllFavorites(userId);
    
    if (result.count === 0) {
      res.json({ 
        message: 'No favorites to clear',
        deletedCount: 0 
      });
    } else {
      res.json({ 
        message: 'All favorites cleared successfully',
        deletedCount: result.count
      });
    }
  } catch (error) {
    handleError(error, res, 'Error clearing favorites');
  }
};

export const checkIsFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateParams(bookIdSchema, req.params, res);
    if (!params) return;
    
    const result = await favoriteService.checkIsFavorite(userId, params.bookId);
    res.json(result);
  } catch (error) {
    handleError(error, res, 'Error checking favorite status');
  }
};

export const getFavoritesCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const count = await favoriteService.getFavoritesCount(userId);
    
    res.json({ count });
  } catch (error) {
    handleError(error, res, 'Error fetching favorites count');
  }
};
