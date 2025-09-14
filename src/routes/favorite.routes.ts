import express from 'express';
import { 
  getUserFavorites, 
  addToFavorites, 
  removeFromFavorites, 
  clearAllFavorites,
  checkIsFavorite,
  getFavoritesCount
} from '../controllers/favorite.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
router.get('/', authenticate, getUserFavorites);
router.get('/count', authenticate, getFavoritesCount);
router.get('/check/:bookId', authenticate, checkIsFavorite);
router.post('/:bookId', authenticate, addToFavorites);
router.delete('/:bookId', authenticate, removeFromFavorites);
router.delete('/', authenticate, clearAllFavorites);

export default router;