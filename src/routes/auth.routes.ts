import express from 'express';
import { register, login, getProfile, getAllUsers } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);

router.get('/profile', authenticate, getProfile);
router.get('/users', authenticate, getAllUsers);

export default router;