import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile // ✅ добавлено
} from '../controllers/authController.js';
import authGuard from '../guards/authGuard.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authGuard, getProfile);
router.put('/profile', authGuard, updateProfile); // ✅ теперь работает

export default router;
