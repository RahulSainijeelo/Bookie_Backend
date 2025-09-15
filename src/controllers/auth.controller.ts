import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import { handleError } from '../utils/api.utils';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
      return;
    }
    
    const { name, email, password, role } = validationResult.data;
 
    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    const token = generateToken(user.id, user.role);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    handleError(error, res, 'Error during registration');
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
      return;
    }
    
    const { email, password, role } = validationResult.data;
  
    const user = await prisma.user.findFirst({
      where: { 
        email,
        role
      }
    });
    
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials or role' });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    handleError(error, res, 'Error during login');
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    handleError(error, res, 'Error fetching user profile');
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userRole = req.user?.role;
    
    if (userRole !== 'ADMIN') {
      res.status(403).json({ message: 'Not authorized to access this resource' });
      return;
    }
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(users);
  } catch (error) {
    handleError(error, res, 'Error fetching users');
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    
    if (!userId || !userRole) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    
    // Generate new token
    const token = generateToken(userId, userRole);
    
    res.json({ token });
  } catch (error) {
    handleError(error, res, 'Error refreshing token');
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logout successful' });
};

const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};