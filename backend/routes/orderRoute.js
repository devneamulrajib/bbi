import express from 'express';
import { 
    placeOrder, 
    placeOrderGuest,    // Imported
    trackOrderByPhone,  // Imported
    allOrders, 
    userOrders, 
    updateStatus, 
    deleteOrder, 
    adminDashboard, 
    getRiderOrders, 
    updatePaymentStatus,
    assignRider
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// --- ADMIN FEATURES ---
orderRouter.get('/dashboard', adminAuth, adminDashboard); 
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus); 
orderRouter.post('/delete', adminAuth, deleteOrder);
orderRouter.post('/assign', adminAuth, assignRider);

// --- RIDER FEATURES ---
orderRouter.post('/rider/list', authUser, getRiderOrders);
orderRouter.post('/rider/status', authUser, updateStatus);
orderRouter.post('/payment', authUser, updatePaymentStatus);

// --- USER & GUEST FEATURES ---
// 1. Standard User Order (Logged In)
orderRouter.post('/place', authUser, placeOrder);

// 2. Guest Order (No Auth)
orderRouter.post('/guest', placeOrderGuest);

// 3. Track Order (No Auth - Public)
orderRouter.post('/track', trackOrderByPhone);

// 4. User Order History
orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;