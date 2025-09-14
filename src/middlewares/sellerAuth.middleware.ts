import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const sellerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    if (!user || user.role !== 'SELLER') {
      res.status(403).json({ message: 'Access denied: Seller role required' });
      return;
    }
    
    next();
  } catch (error) {
    console.error('Seller auth middleware error:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};