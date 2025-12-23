import express from 'express';
import { addCategory, listCategory, removeCategory, removeSubCategory, updateCategory } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';

const categoryRouter = express.Router();

categoryRouter.post('/add', adminAuth, addCategory);
categoryRouter.get('/list', listCategory);
categoryRouter.post('/remove', adminAuth, removeCategory);
categoryRouter.post('/remove-sub', adminAuth, removeSubCategory);
categoryRouter.post('/update', adminAuth, updateCategory); // <--- NEW ROUTE

export default categoryRouter;