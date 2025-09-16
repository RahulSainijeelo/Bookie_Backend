import express from 'express';
import {
  getSellerDashboard,
  getAllUsers,
  updateUserRole,
  getAllBooksSeller,
  approveBook,
  getAllOrders,
  getAnalytics,
  addBook,
  updateBook,
  deleteBook,
  updateOrderStatus
} from '../controllers/seller.controller';
import { authenticate} from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/dashboard', authenticate, getSellerDashboard);
router.get('/users', authenticate, getAllUsers);
router.put('/users/:id/role', authenticate, updateUserRole);
router.get('/books', authenticate, getAllBooksSeller);
router.post('/books', authenticate, addBook);
router.put('/books/:id', authenticate, updateBook);
router.delete('/books/:id', authenticate, deleteBook);
router.put('/books/:id/approve', authenticate, approveBook);

router.get('/orders', authenticate,  getAllOrders);
router.put('/orders/:id/status', authenticate, updateOrderStatus);

router.get('/analytics', authenticate, getAnalytics);

export default router;