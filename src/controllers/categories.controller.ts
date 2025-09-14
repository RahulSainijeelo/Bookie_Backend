import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { categoryIdSchema, categoryQuerySchema } from '../validations/category.validation';
import { handleError, createPaginationResponse } from '../utils/api.utils';
interface FormattedCategory {
  id: string;
  name: string;
  bookCount: number;
  createdAt: Date;
  updatedAt: Date;
}
const formatCategory = (category: any): FormattedCategory => ({
  id: category.id,
  name: category.name,
  bookCount: category._count?.books || 0,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt
});
const validateParams = (schema: any, data: any, res: Response): any | null => {
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

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    const formattedCategories = categories.map(formatCategory);
    res.json({
      categories: formattedCategories,
      count: formattedCategories.length
    });
  } catch (error) {
    handleError(error, res, 'Error fetching categories');
  }
};

export const getBooksByCategoryId = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateParams(categoryIdSchema, req.params, res);
    if (!params) return;
    
    const queryParams = validateParams(categoryQuerySchema, req.query, res);
    if (!queryParams) return;
    
    const { id } = params;
    const [category, booksResult] = await Promise.all([
      categoryService.getCategoryById(id),
      categoryService.getBooksByCategory(id, queryParams)
    ]);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    const { books, total } = booksResult;
    res.json({
      category: formatCategory(category),
      books,
      ...createPaginationResponse(books, queryParams.page, queryParams.limit, total)
    });
  } catch (error) {
    handleError(error, res, 'Error fetching books by category');
  }
};
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const params = validateParams(categoryIdSchema, req.params, res);
    if (!params) return;
    
    const { id } = params;
    
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(formatCategory(category));
  } catch (error) {
    handleError(error, res, 'Error fetching category');
  }
};