import express from 'express';
import { updateFeature, getFeature } from '../controllers/featureController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const featureRouter = express.Router();

featureRouter.post('/update', adminAuth, upload.single('image'), updateFeature);
featureRouter.get('/get', getFeature);

export default featureRouter;