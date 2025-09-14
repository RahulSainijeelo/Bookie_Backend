import { Response } from 'express';

export const handleSellerError = (error: unknown, res: Response): boolean => {
  if (error instanceof Error) {
    if (['Book not found', 'Order not found', 'User not found'].includes(error.message)) {
      res.status(404).json({ message: error.message });
      return true;
    }
    if (error.message.includes('Access denied')) {
      res.status(403).json({ message: error.message });
      return true;
    }
    if (error.message.includes('Cannot delete book')) {
      res.status(400).json({ message: error.message });
      return true;
    }
    if (error.message === 'Invalid category ID') {
      res.status(400).json({ message: error.message });
      return true;
    }
  }
  
  return false;
};