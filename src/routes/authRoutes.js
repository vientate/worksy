import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import authGuard from '../guards/authGuard.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authGuard, getProfile);

export default router;
