import express from 'express';
import { getPage, updatePage } from '../controllers/pageController.js';
import adminAuth from '../middleware/adminAuth.js';

const pageRouter = express.Router();

pageRouter.get('/:slug', getPage);
pageRouter.post('/update', adminAuth, updatePage);

export default pageRouter;