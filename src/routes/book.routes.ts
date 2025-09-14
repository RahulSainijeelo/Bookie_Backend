import express from 'express';
import { 
  getAllBooks,
  getBookById,
  getBooksByCategory,
  getBookReviews,
  addBookReview,
  searchBooks
} from '../controllers/book.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/category/:category', getBooksByCategory);
router.get('/:id', getBookById);
router.get('/:id/reviews', getBookReviews);
router.post('/:id/reviews', authenticate, addBookReview);

export default router;
