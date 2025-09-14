import { Request, Response } from 'express';
import { 
  createOrderSchema, 
  orderQuerySchema, 
  orderIdSchema 
} from '../validations/order.validation';
import { orderService } from '../services/order.service';
import { handleError } from '../utils/api.utils';
import { handleOrderError } from '../utils/order.utils';
const checkAuth = (req: Request, res: Response): string | null => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return null;
  }
  return userId;
};
const validateData = (schema: any, data: any, res: Response): any | null => {
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
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const orderData = validateData(createOrderSchema, req.body, res);
    if (!orderData) return;
    
    try {
      const order = await orderService.createOrder(userId, orderData);
      await orderService.clearUserCart(userId);
      
      // In a real app, you would:
      // 1. Process payment with a payment gateway
      // 2. Send confirmation email
      
      res.status(201).json({
        message: 'Order created successfully',
        order
      });
    } catch (error) {
      if (handleOrderError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error creating order');
  }
};
export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateData(orderQuerySchema, req.query, res);
    if (!params) return;
    const { orders, total } = await orderService.getUserOrders(userId, params);
    
    res.json({
      orders,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(total / params.limit),
        limit: params.limit,
        total
      }
    });
  } catch (error) {
    handleError(error, res, 'Error fetching orders');
  }
};
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateData(orderIdSchema, req.params, res);
    if (!params) return;
    try {
      const order = await orderService.getOrderById(userId, params.id);
      res.json(order);
    } catch (error) {
      if (handleOrderError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error fetching order');
  }
};
export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateData(orderIdSchema, req.params, res);
    if (!params) return;
    try {
      const result = await orderService.cancelOrder(userId, params.id);
      res.json(result);
    } catch (error) {
      if (handleOrderError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error cancelling order');
  }
};
export const getOrderTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateData(orderIdSchema, req.params, res);
    if (!params) return;
    
    try {
      const tracking = await orderService.getOrderTracking(userId, params.id);
      res.json(tracking);
    } catch (error) {
      if (handleOrderError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error fetching tracking information');
  }
};