import { Request, Response } from 'express';
import { sellerService } from '../services/seller.service';
import { 
  userRoleSchema, 
  bookSchema, 
  orderStatusSchema, 
  paginationSchema,
  bookIdSchema,
  userIdSchema,
  orderIdSchema
} from '../validations/seller.validation';
import { handleError } from '../utils/api.utils';
import { handleSellerError } from '../utils/seller.utils';

const checkAuth = (req: Request, res: Response): string | null => {
  const sellerId = req.user?.id;
  if (!sellerId) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return sellerId;
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

export const getSellerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellerId = checkAuth(req, res);
    if (!sellerId) return;
    
    const dashboardData = await sellerService.getSellerDashboard(sellerId);
    res.json(dashboardData);
  } catch (error) {
    handleError(error, res, 'Error fetching seller dashboard');
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateData(paginationSchema, req.query, res);
    if (!params) return;
    
    const { users, total } = await sellerService.getAllUsers(params);
    
    res.json({
      users,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit)
      }
    });
  } catch (error) {
    handleError(error, res, 'Error fetching users');
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateData(userIdSchema, req.params, res);
    if (!params) return;
    const roleData = validateData(userRoleSchema, req.body, res);
    if (!roleData) return;
    
    try {
      const updatedUser = await sellerService.updateUserRole(params.id, roleData.role);
      res.json(updatedUser);
    } catch (error) {
      if (handleSellerError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error updating user role');
  }
};

export const getAllBooksSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateData(paginationSchema, req.query, res);
    if (!params) return;
    
    const { books, total } = await sellerService.getAllBooks(params);
    
    res.json({
      books,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit)
      }
    });
  } catch (error) {
    handleError(error, res, 'Error fetching books for seller');
  }
};

export const approveBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateData(bookIdSchema, req.params, res);
    if (!params) return;
    
    try {
      const updatedBook = await sellerService.approveBook(params.id);
      res.json(updatedBook);
    } catch (error) {
      if (handleSellerError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error approving book');
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateData(paginationSchema, req.query, res);
    if (!params) return;
    
    const { orders, total } = await sellerService.getAllOrders(params);
    
    res.json({
      orders,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        pages: Math.ceil(total / params.limit)
      }
    });
  } catch (error) {
    handleError(error, res, 'Error fetching orders');
  }
};

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const analytics = await sellerService.getAnalytics();
    res.json(analytics);
  } catch (error) {
    handleError(error, res, 'Error fetching analytics');
  }
};

export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellerId = checkAuth(req, res);
    if (!sellerId) return;
    
    const bookData = validateData(bookSchema, req.body, res);
    if (!bookData) return;
    
    const categoryExists = await sellerService.validateCategoryExists(bookData.categoryId);
    if (!categoryExists) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }
    
    const newBook = await sellerService.addBook(sellerId, bookData);
    res.status(201).json(newBook);
  } catch (error) {
    handleError(error, res, 'Error adding book');
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellerId = checkAuth(req, res);
    if (!sellerId) return;
    
    const params = validateData(bookIdSchema, req.params, res);
    if (!params) return;
    const bookData = validateData(bookSchema.partial(), req.body, res);
    if (!bookData) return;
    if (bookData.categoryId) {
      const categoryExists = await sellerService.validateCategoryExists(bookData.categoryId);
      if (!categoryExists) {
        res.status(400).json({ message: 'Invalid category ID' });
        return;
      }
    }
    
    try {
      const updatedBook = await sellerService.updateBook(params.id, sellerId, bookData);
      res.json(updatedBook);
    } catch (error) {
      if (handleSellerError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error updating book');
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellerId = checkAuth(req, res);
    if (!sellerId) return;
    const params = validateData(bookIdSchema, req.params, res);
    if (!params) return;
    
    try {
      const result = await sellerService.deleteBook(params.id, sellerId);
      res.json(result);
    } catch (error) {
      if (handleSellerError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error deleting book');
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellerId = checkAuth(req, res);
    if (!sellerId) return;
    const params = validateData(orderIdSchema, req.params, res);
    if (!params) return;
    const statusData = validateData(orderStatusSchema, req.body, res);
    if (!statusData) return;
    
    try {
      const updatedOrder = await sellerService.updateOrderStatus(
        params.id, 
        sellerId, 
        statusData.status
      );
      res.json(updatedOrder);
    } catch (error) {
      if (handleSellerError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error updating order status');
  }
};
