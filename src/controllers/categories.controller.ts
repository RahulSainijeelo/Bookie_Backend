import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { 
  categoryIdSchema, 
  categoryQuerySchema,
  createCategorySchema 
} from '../validations/category.validation';
import { handleError, createPaginationResponse } from '../utils/api.utils';
import { handleCategoryError } from '../utils/category.utils';

// Type for formatted category response
interface FormattedCategory {
  id: string;
  name: string;
  bookCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Helper to standardize category formatting
const formatCategory = (category: any): FormattedCategory => ({
  id: category.id,
  name: category.name,
  bookCount: category._count?.books || 0,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt
});

// Helper function to validate request parameters
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

/**
 * Get all categories
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    
    // Map the response to include the book count directly using the helper
    const formattedCategories = categories.map(formatCategory);
    
    res.json({
      categories: formattedCategories,
      count: formattedCategories.length
    });
  } catch (error) {
    handleError(error, res, 'Error fetching categories');
  }
};

/**
 * Get books by category ID
 */
export const getBooksByCategoryId = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate parameters
    const params = validateParams(categoryIdSchema, req.params, res);
    if (!params) return;
    
    const queryParams = validateParams(categoryQuerySchema, req.query, res);
    if (!queryParams) return;
    
    const { id } = params;
    
    // Optimize - get category and books in parallel since we'll need both
    const [category, booksResult] = await Promise.all([
      categoryService.getCategoryById(id),
      categoryService.getBooksByCategory(id, queryParams)
    ]);
    
    // Handle category not found
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    
    const { books, total } = booksResult;
    
    // Format response with consistent structure
    res.json({
      category: formatCategory(category),
      books,
      ...createPaginationResponse(books, queryParams.page, queryParams.limit, total)
    });
  } catch (error) {
    handleError(error, res, 'Error fetching books by category');
  }
};

/**
 * Get a specific category by ID
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate parameters
    const params = validateParams(categoryIdSchema, req.params, res);
    if (!params) return;
    
    const { id } = params;
    
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    
    // Use the standard format helper
    res.json(formatCategory(category));
  } catch (error) {
    handleError(error, res, 'Error fetching category');
  }
};

/**
 * Create a new category
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const categoryData = validateParams(createCategorySchema, req.body, res);
    if (!categoryData) return;
    
    try {
      const newCategory = await categoryService.createCategory(categoryData);
      
      // Return the formatted category
      res.status(201).json({
        message: 'Category created successfully',
        category: formatCategory(newCategory)
      });
    } catch (error) {
      // Handle specific category errors
      if (handleCategoryError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error creating category');
  }
};