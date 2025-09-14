import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart,
  getCartItemCount
} from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Get user's cart
router.get('/', authenticate, getCart);

// Get cart item count
router.get('/count', authenticate, getCartItemCount);

// Add item to cart
router.post('/', authenticate, addToCart);

// Update cart item quantity
router.put('/:itemId', authenticate, updateCartItem);

// Remove item from cart
router.delete('/:itemId', authenticate, removeCartItem);

// Clear entire cart
router.delete('/', authenticate, clearCart);

export default router;