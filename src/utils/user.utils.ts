import { Response } from 'express';
import { 
  EmailInUseError, 
  ResourceNotFoundError, 
  AuthenticationError 
} from '../services/user.service';

export const handleUserError = (error: unknown, res: Response): boolean => {
  if (error instanceof EmailInUseError) {
    res.status(400).json({ message: error.message });
    return true;
  }
  
  if (error instanceof ResourceNotFoundError) {
    res.status(404).json({ message: error.message });
    return true;
  }
  
  if (error instanceof AuthenticationError) {
    res.status(401).json({ message: error.message });
    return true;
  }
  
  return false;
};