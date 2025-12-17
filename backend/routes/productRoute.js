import express from 'express';
import { addProduct, listProducts } from '../controllers/productController.js'; // + removeProduct if you have it
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js'; // <--- Import the middleware

const productRouter = express.Router();

// 1. Add adminAuth before upload.fields
// 2. We keep listProducts public (no auth needed) so users can see products
productRouter.post('/add', adminAuth, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), addProduct);
productRouter.post('/remove', adminAuth, async (req, res) => {
    // You can implement remove logic here or in controller
});
productRouter.get('/list', listProducts);

export default productRouter;