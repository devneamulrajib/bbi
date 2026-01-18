import express from 'express';
import { 
    sendOtp, 
    toggleWishlist, 
    loginUser, 
    registerUser, 
    adminLogin, 
    getUserProfile, 
    updateProfile, 
    allUsers, 
    deleteUser, 
    getSingleUser, 
    adminManageUser,
    getAdminProfile,       // New Import
    updateAdminProfile     // New Import
} from '../controllers/userController.js';
import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; 
import upload from '../middleware/multer.js'; // Import Multer for Image Upload

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/send-otp', sendOtp);

// Customer/User Routes (Protected by authUser)
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update-profile', authUser, updateProfile);
userRouter.post('/wishlist', authUser, toggleWishlist);

// --- ADMIN ROUTES (Protected by adminAuth) ---
userRouter.get('/list', adminAuth, allUsers);
userRouter.post('/delete', adminAuth, deleteUser);
userRouter.post('/single', adminAuth, getSingleUser);
userRouter.post('/manage', adminAuth, adminManageUser); 

// Admin Profile Routes (New)
userRouter.get('/admin-profile', adminAuth, getAdminProfile);
userRouter.post('/update-admin-profile', adminAuth, upload.single('image'), updateAdminProfile);

export default userRouter;