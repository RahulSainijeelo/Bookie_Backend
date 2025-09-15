import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role:string
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }
    const authParts = req.headers.authorization.split(' ');
    if (authParts.length !== 2) {
      res.status(401).json({ message: 'Invalid authorization format' });
      return;
    }
    
    const token = authParts[1];
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }

    const decoded:any = jwt.verify(token, process.env.JWT_SECRET);
  
    if (typeof decoded === 'object' && decoded && 'id' in decoded) {
      req.user = { id: decoded.id as string,role:decoded.role as string };
      next();
    } else {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
    return;
  }
};
