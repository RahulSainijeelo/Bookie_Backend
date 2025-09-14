import express from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getDefaultAddress
} from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Profile management
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.put('/change-password', authenticate, changePassword);

// Address management
router.get('/addresses', authenticate, getUserAddresses);
router.post('/addresses', authenticate, addUserAddress);
router.put('/addresses/:id', authenticate, updateUserAddress);
router.delete('/addresses/:id', authenticate, deleteUserAddress);
router.get('/addresses/default', authenticate, getDefaultAddress);

export default router;