import { Response } from 'express';

export const handleError = (error: unknown, res: Response, message: string = 'Server error') => {
  console.error(`${message}:`, error);
  res.status(500).json({ 
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  });
};

export const createPaginationResponse = (items: any[], page: number, limit: number, total: number) => {
  return {
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
      total
    }
  };
};