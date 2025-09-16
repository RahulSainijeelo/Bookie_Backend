import express from 'express';
import { 
  getAllCategories, 
  getBooksByCategoryId,
  getCategoryById,
  createCategory
} from '../controllers/categories.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.get('/:id/books', getBooksByCategoryId);

router.post('/', authenticate, createCategory);

export default router;