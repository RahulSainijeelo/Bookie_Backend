import express from 'express';
import { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  cancelOrder, 
  getOrderTracking 
} from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);
router.get('/:id/track', authenticate, getOrderTracking);

export default router;