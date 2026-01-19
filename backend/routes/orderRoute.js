import express from 'express';
import { 
    placeOrder, 
    allOrders, 
    userOrders, 
    updateStatus, 
    deleteOrder, 
    adminDashboard, 
    getRiderOrders, 
    updatePaymentStatus,
    assignRider         // Added this import
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// --- ADMIN FEATURES ---
orderRouter.get('/dashboard', adminAuth, adminDashboard); 
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus); // Admin Only
orderRouter.post('/delete', adminAuth, deleteOrder);
orderRouter.post('/assign', adminAuth, assignRider); // New Route for assigning riders

// --- RIDER FEATURES ---
// 1. Get Assigned Orders
orderRouter.post('/rider/list', authUser, getRiderOrders);

// 2. Update Status (Rider Version)
orderRouter.post('/rider/status', authUser, updateStatus);

// 3. Collect Payment
orderRouter.post('/payment', authUser, updatePaymentStatus);

// --- USER FEATURES ---
// Payment (COD) Place Order
orderRouter.post('/place', authUser, placeOrder);

// User Order History
orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;