import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Profile Routes
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update-profile', authUser, updateProfile);

export default userRouter;