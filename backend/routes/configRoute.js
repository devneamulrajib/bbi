import express from 'express';
import { getConfig, updateConfig, addPromo, listPromos, deletePromo, checkPromo } from '../controllers/configController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const configRouter = express.Router();

// Get Configuration
configRouter.get('/get', getConfig);

// Update Configuration (Admin Only)
// Added slider images (s1Img, s2Img, s3Img) to the allowed upload fields
configRouter.post('/update', adminAuth, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'tImage', maxCount: 1 },
    { name: 'b1Image', maxCount: 1 },
    { name: 'b2Image', maxCount: 1 },
    { name: 's1Img', maxCount: 1 },
    { name: 's2Img', maxCount: 1 },
    { name: 's3Img', maxCount: 1 }
]), updateConfig);

// Promo Routes
configRouter.post('/promo/add', adminAuth, addPromo);
configRouter.get('/promo/list', adminAuth, listPromos);
configRouter.post('/promo/delete', adminAuth, deletePromo);
configRouter.post('/promo/check', checkPromo); // Public route for checking coupons in cart

export default configRouter;