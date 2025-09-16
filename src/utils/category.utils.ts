import { Response } from 'express';
import { CategoryExistsError } from '../services/category.service';

export const handleCategoryError = (error: unknown, res: Response): boolean => {
  if (error instanceof CategoryExistsError) {
    res.status(400).json({ message: error.message });
    return true;
  }
  
  return false;
};