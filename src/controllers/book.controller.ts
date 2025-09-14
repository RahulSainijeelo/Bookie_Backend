import { Request, Response } from 'express';
import { bookService } from '../services/book.service';
import { handleError, createPaginationResponse } from '../utils/api.utils';
import { 
  bookQuerySchema, 
  reviewQuerySchema, 
  reviewBodySchema, 
  bookIdSchema,
  categorySchema
} from '../validations/book.validation';
import prisma from '../lib/prisma';

const checkAuth = (req: Request): string | null => {
  return req.user?.id || null;
};

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = bookQuerySchema.safeParse(req.query);
    
    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: validationResult.error.format() 
      });
      return;
    }
    
    const params = validationResult.data;
    const { books, total } = await bookService.getAllBooks(params);

    res.json({
      books,
      ...createPaginationResponse(books, params.page, params.limit, total)
    });
  } catch (error) {
    handleError(error, res, 'Error fetching books');
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramValidation = bookIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      res.status(400).json({ 
        message: 'Invalid book ID', 
        errors: paramValidation.error.format() 
      });
      return;
    }
    
    const { id } = paramValidation.data;
    const book = await bookService.getBookById(id);
    
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    const userId = checkAuth(req);
    if (!book.isApproved && book.sellerId !== userId) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json(book);
  } catch (error) {
    handleError(error, res, 'Error fetching book');
  }
};

export const getBooksByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramValidation = categorySchema.safeParse(req.params);
    if (!paramValidation.success) {
      res.status(400).json({ 
        message: 'Invalid category ID', 
        errors: paramValidation.error.format() 
      });
      return;
    }
    
    const queryValidation = bookQuerySchema.partial().safeParse(req.query);
    if (!queryValidation.success) {
      res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: queryValidation.error.format() 
      });
      return;
    }
    
    const { categoryId } = paramValidation.data;
    const queryParams = queryValidation.data;

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    
    const { books, total } = await bookService.getBooksByCategory(
      categoryId, 
      {
        page: queryParams.page || 1,
        limit: queryParams.limit || 10,
        sortBy: queryParams.sortBy || 'createdAt',
        sortOrder: queryParams.sortOrder || 'desc'
      }
    );
    
    res.json({
      books,
      category,
      ...createPaginationResponse(books, queryParams.page || 1, queryParams.limit || 10, total)
    });
  } catch (error) {
    handleError(error, res, 'Error fetching books by category');
  }
};

export const getBookReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramValidation = bookIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      res.status(400).json({ 
        message: 'Invalid book ID', 
        errors: paramValidation.error.format() 
      });
      return;
    }
    
    const validationResult = reviewQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Invalid query parameters', 
        errors: validationResult.error.format() 
      });
      return;
    }
    
    const { id } = paramValidation.data;
    const { page, limit } = validationResult.data;
  
    const book = await prisma.book.findUnique({
      where: { id },
      select: { 
        id: true, 
        isApproved: true,
        title: true
      }
    });
    
    if (!book || !book.isApproved) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    
    const { reviews, total } = await bookService.getBookReviews(id, page, limit);

    res.json({
      reviews,
      book: {
        id: book.id,
        title: book.title
      },
      ...createPaginationResponse(reviews, page, limit, total)
    });
  } catch (error) {
    handleError(error, res, 'Error fetching book reviews');
  }
};

export const addBookReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    const paramValidation = bookIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      res.status(400).json({ 
        message: 'Invalid book ID', 
        errors: paramValidation.error.format() 
      });
      return;
    }
    
    const validationResult = reviewBodySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
      return;
    }
    
    const { id } = paramValidation.data;
    const reviewData = validationResult.data;
    
    try {
      const result = await bookService.addBookReview(id, userId, reviewData);
      
      res.status(201).json({
        review: result.review,
        book: {
          id: result.book.id,
          title: result.book.title
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Book not found') {
          res.status(404).json({ message: 'Book not found' });
          return;
        }
        if (['You have already reviewed this book', 'You cannot review your own book'].includes(error.message)) {
          res.status(400).json({ message: error.message });
          return;
        }
      }
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error adding review');
  }
};

export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    await getAllBooks(req, res);
  } catch (error) {
    handleError(error, res, 'Error searching books');
  }
};

export const getBookCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await bookService.getCategories();
    res.json(categories);
  } catch (error) {
    handleError(error, res, 'Error fetching categories');
  }
};

export const getFeaturedBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const featuredBooks = await bookService.getFeaturedBooks();
    res.json(featuredBooks);
  } catch (error) {
    handleError(error, res, 'Error fetching featured books');
  }
};
