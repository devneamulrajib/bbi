import express from 'express';
import { placeOrder, allOrders, userOrders, updateStatus, deleteOrder, adminDashboard } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin Features
orderRouter.get('/dashboard', adminAuth, adminDashboard); // New Dashboard Route
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);
orderRouter.post('/delete', adminAuth, deleteOrder);

// Payment Features (COD)
orderRouter.post('/place', authUser, placeOrder);

// User Features
orderRouter.post('/userorders', authUser, userOrders);

export default orderRouter;