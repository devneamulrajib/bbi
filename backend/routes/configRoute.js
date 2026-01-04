import express from 'express';
import { getConfig, updateConfig } from '../controllers/configController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const configRouter = express.Router();

configRouter.get('/get', getConfig);
configRouter.post('/update', adminAuth, upload.fields([
    { name: 'tImage', maxCount: 1 },
    { name: 'b1Image', maxCount: 1 },
    { name: 'b2Image', maxCount: 1 }
]), updateConfig);

export default configRouter;