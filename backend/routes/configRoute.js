import express from 'express';
import { getConfig, updateConfig, addPromo, listPromos, deletePromo, checkPromo } from '../controllers/configController.js'; // Import checkPromo
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const configRouter = express.Router();

configRouter.get('/get', getConfig);
configRouter.post('/update', adminAuth, upload.fields([{ name: 'logo', maxCount: 1 },{ name: 'tImage', maxCount: 1 }, { name: 'b1Image', maxCount: 1 }, { name: 'b2Image', maxCount: 1 }]), updateConfig);

// Promo Routes
configRouter.post('/promo/add', adminAuth, addPromo);
configRouter.get('/promo/list', adminAuth, listPromos);
configRouter.post('/promo/delete', adminAuth, deletePromo);
configRouter.post('/promo/check', checkPromo); // <--- NEW PUBLIC ROUTE

export default configRouter;