import express from 'express';
import { submitContact, getAllMessages, deleteMessage, getContactSettings, updateContactSettings } from '../controllers/contactController.js';
import adminAuth from '../middleware/adminAuth.js';
import { markAllRead } from '../controllers/contactController.js';

const contactRouter = express.Router();

// Messages
contactRouter.post('/submit', submitContact);
contactRouter.post('/mark-read', adminAuth, markAllRead);
contactRouter.get('/all', adminAuth, getAllMessages);
contactRouter.post('/delete', adminAuth, deleteMessage); // <--- New Delete Route

// Settings (Address/Email/Phone)
contactRouter.get('/settings', getContactSettings); 
contactRouter.post('/settings/update', adminAuth, updateContactSettings); // <--- New Update Route

export default contactRouter;