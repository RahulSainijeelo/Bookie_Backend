import { Request, Response } from 'express';
import { 
  updateProfileSchema, 
  changePasswordSchema, 
  addressSchema,
  addressIdSchema
} from '../validations/user.validation';
import { userService } from '../services/user.service';
import { handleError } from '../utils/api.utils';
import { handleUserError } from '../utils/user.utils';
const checkAuth = (req: Request, res: Response): string | null => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ message: 'User not authenticated' });
    return null;
  }
  return userId;
};

const validateData = (schema: any, data: any, res: Response): any | null => {
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

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    try {
      const user = await userService.getUserProfile(userId);
      res.json(user);
    } catch (error) {
      if (handleUserError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error fetching user profile');
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const profileData = validateData(updateProfileSchema, req.body, res);
    if (!profileData) return;
    if (Object.keys(profileData).length === 0) {
      res.status(400).json({ message: 'No data provided for update' });
      return;
    }
    
    try {
      const updatedUser = await userService.updateUserProfile(userId, profileData);
      res.json(updatedUser);
    } catch (error) {
      if (handleUserError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error updating user profile');
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const passwordData = validateData(changePasswordSchema, req.body, res);
    if (!passwordData) return;
    
    const { currentPassword, newPassword } = passwordData;
    if (currentPassword === newPassword) {
      res.status(400).json({ message: 'New password must be different from current password' });
      return;
    }
    
    try {
      const result = await userService.changePassword(userId, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      if (handleUserError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error changing password');
  }
};

export const getUserAddresses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const addresses = await userService.getUserAddresses(userId);
    res.json(addresses);
  } catch (error) {
    handleError(error, res, 'Error fetching user addresses');
  }
};

export const addUserAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const addressData = validateData(addressSchema, req.body, res);
    if (!addressData) return;
    
    const newAddress = await userService.addUserAddress(userId, addressData);
    res.status(201).json(newAddress);
  } catch (error) {
    handleError(error, res, 'Error adding address');
  }
};

export const updateUserAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    const params = validateData(addressIdSchema, req.params, res);
    if (!params) return;
    
    const addressData = validateData(addressSchema.partial(), req.body, res);
    if (!addressData) return;
    
    if (Object.keys(addressData).length === 0) {
      res.status(400).json({ message: 'No data provided for update' });
      return;
    }
    
    try {
      const updatedAddress = await userService.updateUserAddress(userId, params.id, addressData);
      res.json(updatedAddress);
    } catch (error) {
      if (handleUserError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error updating address');
  }
};

export const deleteUserAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    const params = validateData(addressIdSchema, req.params, res);
    if (!params) return;
    
    try {
      const result = await userService.deleteUserAddress(userId, params.id);
      res.json(result);
    } catch (error) {
      if (handleUserError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error deleting address');
  }
};

export const getDefaultAddress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;
    
    try {
      const defaultAddress = await userService.getDefaultAddress(userId);
      res.json(defaultAddress);
    } catch (error) {
      if (handleUserError(error, res)) return;
      throw error;
    }
  } catch (error) {
    handleError(error, res, 'Error fetching default address');
  }
};
