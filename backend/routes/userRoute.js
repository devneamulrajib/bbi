import express from 'express';
import { loginUser, registerUser, adminLogin, getUserProfile, updateProfile, allUsers, deleteUser, getSingleUser, adminManageUser } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; // Ensure you have this

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// User Routes
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update-profile', authUser, updateProfile);

// --- NEW ADMIN ROUTES ---
userRouter.get('/list', adminAuth, allUsers);
userRouter.post('/delete', adminAuth, deleteUser);
userRouter.post('/single', adminAuth, getSingleUser);
userRouter.post('/manage', adminAuth, adminManageUser); // Handles Add and Edit

export default userRouter;