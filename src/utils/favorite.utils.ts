import { Response } from 'express';

export const handleFavoriteError = (error: unknown, res: Response): boolean => {
  if (error instanceof Error) {
    if (error.message === 'Book not found') {
      res.status(404).json({ message: 'Book not found' });
      return true;
    }
    
    if (error.message === 'Book already in favorites') {
      res.status(400).json({ message: 'Book already in favorites' });
      return true;
    }
    
    if (error.message === 'Book is not available') {
      res.status(400).json({ message: 'Book is not available for favorites' });
      return true;
    }
    
    if (error.message === 'Favorite not found') {
      res.status(404).json({ message: 'Book not found in favorites' });
      return true;
    }
  }
  
  return false;
};