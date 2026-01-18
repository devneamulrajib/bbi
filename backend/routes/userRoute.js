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
    getAdminProfile,       
    updateAdminProfile     
} from '../controllers/userController.js';

// --- NEW IMPORTS (For Staff & Rider System) ---
import { 
    addStaff, 
    getAllStaff, 
    deleteStaff, 
    staffLogin, 
    assignRider, 
    getRiderOrders, 
    updateRiderStatus, 
    markOrderPaid 
} from '../controllers/staffController.js';

import authUser from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; 
import upload from '../middleware/multer.js'; 

const userRouter = express.Router();

// ==========================
// PUBLIC ROUTES
// ==========================
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin); // Old Super Admin Login
userRouter.post('/send-otp', sendOtp);

// ==========================
// CUSTOMER ROUTES
// ==========================
userRouter.get('/profile', authUser, getUserProfile);
userRouter.post('/update-profile', authUser, updateProfile);
userRouter.post('/wishlist', authUser, toggleWishlist);

// ==========================
// ADMIN MANAGEMENT ROUTES
// ==========================
userRouter.get('/list', adminAuth, allUsers);
userRouter.post('/delete', adminAuth, deleteUser);
userRouter.post('/single', adminAuth, getSingleUser);
userRouter.post('/manage', adminAuth, adminManageUser); 

// Admin Profile
userRouter.get('/admin-profile', adminAuth, getAdminProfile);
userRouter.post('/update-admin-profile', adminAuth, upload.single('image'), updateAdminProfile);

// ==========================
// STAFF & RIDER ROUTES (NEW)
// ==========================

// Staff Authentication (Unified Login for Staff/Riders)
userRouter.post('/staff/login', staffLogin); 

// Staff Management (Super Admin/Manager can access - controlled by frontend/middleware)
userRouter.post('/staff/add', adminAuth, addStaff);
userRouter.get('/staff/list', adminAuth, getAllStaff);
userRouter.post('/staff/delete', adminAuth, deleteStaff);

// Delivery Logic
userRouter.post('/order/assign', adminAuth, assignRider); // Admin assigns order to rider

// Rider Panel Endpoints (Used by the Rider Subdomain)
userRouter.post('/rider/orders', getRiderOrders);    // Fetch orders for logged-in rider
userRouter.post('/rider/status', updateRiderStatus); // Update status (Delivered, etc.)
userRouter.post('/rider/pay', markOrderPaid);        // Mark as Paid (Cash Collected)

export default userRouter;