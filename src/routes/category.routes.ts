import express from 'express';
import { 
  getAllCategories, 
  getBooksByCategoryId,
  getCategoryById
} from '../controllers/categories.controller';

const router = express.Router();
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:id/books', getBooksByCategoryId);
export default router;