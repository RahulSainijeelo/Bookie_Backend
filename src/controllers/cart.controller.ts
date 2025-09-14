import { Request, Response } from 'express';
import { cartService } from '../services/cart.service';
import { handleError } from '../utils/api.utils';
import { 
  addToCartSchema, 
  updateCartSchema, 
  cartItemIdSchema 
} from '../validations/cart.validation';

// Helper function for authentication check
const checkAuth = (req: Request, res: Response): string | null => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return null;
  }
  return userId;
};

// Standard cart response helper
const formatCartResponse = (cart: any) => {
  const items = cart?.items || [];
  const total = cartService.calculateCartTotal(items);
  return { items, total };
};

// Handle specific cart errors
const handleCartError = (error: unknown, res: Response): boolean => {
  if (error instanceof Error) {
    // Handle not found errors
    if (['Cart not found', 'Item not found in cart', 'Book not found'].includes(error.message)) {
      res.status(404).json({ message: error.message });
      return true;
    }
    
    // Handle validation/business logic errors
    if (error.message.includes('Not enough stock') || error.message.includes('not approved')) {
      res.status(400).json({ message: error.message });
      return true;
    }
  }
  return false;
};

// Get user's cart
export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const cart = await cartService.getCart(userId);
    
    // Return consistent structure whether cart exists or not
    res.json(formatCartResponse(cart));
  } catch (error) {
    handleError(error, res, 'Error fetching cart');
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    // Validate request body
    const validationResult = addToCartSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
      return;
    }
    
    const { bookId, quantity } = validationResult.data;
    
    try {
      const cart = await cartService.addToCart(userId, bookId, quantity);
      res.json(formatCartResponse(cart));
    } catch (error) {
      if (!handleCartError(error, res)) {
        handleError(error, res, 'Error adding to cart');
      }
    }
  } catch (error) {
    handleError(error, res, 'Error processing add to cart request');
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    // Validate params and request body
    const paramsValidation = cartItemIdSchema.safeParse(req.params);
    const bodyValidation = updateCartSchema.safeParse(req.body);
    
    // Handle validation errors
    if (!paramsValidation.success) {
      res.status(400).json({ 
        message: 'Invalid cart item ID', 
        errors: paramsValidation.error.format() 
      });
      return;
    }
    
    if (!bodyValidation.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: bodyValidation.error.format() 
      });
      return;
    }
    
    const { itemId } = paramsValidation.data;
    const { quantity } = bodyValidation.data;
    
    try {
      const cart = await cartService.updateCartItem(userId, itemId, quantity);
      res.json(formatCartResponse(cart));
    } catch (error) {
      if (!handleCartError(error, res)) {
        handleError(error, res, 'Error updating cart item');
      }
    }
  } catch (error) {
    handleError(error, res, 'Error processing update cart request');
  }
};

// Remove item from cart
export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    // Validate params
    const paramsValidation = cartItemIdSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      res.status(400).json({ 
        message: 'Invalid cart item ID', 
        errors: paramsValidation.error.format() 
      });
      return;
    }
    
    const { itemId } = paramsValidation.data;
    
    try {
      const cart = await cartService.removeCartItem(userId, itemId);
      res.json(formatCartResponse(cart));
    } catch (error) {
      if (!handleCartError(error, res)) {
        handleError(error, res, 'Error removing cart item');
      }
    }
  } catch (error) {
    handleError(error, res, 'Error processing remove item request');
  }
};

// Clear entire cart
export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    await cartService.clearCart(userId);
    
    res.json({
      items: [],
      total: 0,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    handleError(error, res, 'Error clearing cart');
  }
};

// Get cart item count (useful for navbar badge)
export const getCartItemCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const itemCount = await cartService.getCartItemCount(userId);
    
    res.json({ itemCount });
  } catch (error) {
    handleError(error, res, 'Error fetching cart item count');
  }
};
