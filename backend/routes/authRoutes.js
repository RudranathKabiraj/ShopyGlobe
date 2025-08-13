import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser); // POST /register
router.post('/login', loginUser);       // POST /login

export default router;
