import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct, updateProduct, addReview, deleteReview, allReviews } from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const productRouter = express.Router();

// ... (Existing routes) ...
productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.post('/update', adminAuth, updateProduct);
productRouter.get('/list', listProducts);

// Review Routes
productRouter.post('/review/add', authUser, addReview);
productRouter.post('/review/delete', adminAuth, deleteReview);
productRouter.get('/reviews', adminAuth, allReviews); // <--- NEW ROUTE

export default productRouter;