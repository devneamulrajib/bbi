import express from 'express';
import { sendOtp, toggleWishlist, loginUser, registerUser, adminLogin, getUserProfile, updateProfile, allUsers, deleteUser, getSingleUser, adminManageUser } from '../controllers/userController.js';
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
userRouter.post('/send-otp', sendOtp);

// --- NEW ADMIN ROUTES ---
userRouter.get('/list', adminAuth, allUsers);
userRouter.post('/delete', adminAuth, deleteUser);
userRouter.post('/single', adminAuth, getSingleUser);
userRouter.post('/manage', adminAuth, adminManageUser); // Handles Add and Edit
userRouter.post('/wishlist', authUser, toggleWishlist);
export default userRouter;