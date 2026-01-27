import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import featureRouter from './routes/featureRoute.js';
import configRouter from './routes/configRoute.js';
import pageRouter from './routes/pageRoute.js';
import contactRouter from './routes/contactRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';

// App Config
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// --- ALLOW FRONTEND ACCESS TO UPLOADS FOLDER (THE FIX) ---
// This assumes your images are saved in a root folder named 'uploads'
app.use('/images', express.static('uploads')); 

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'https://babaibangladesh.com',
    'https://www.babaibangladesh.com',
    'https://rider.babaibangladesh.com',
    'https://admin.babaibangladesh.com',
    'https://babaibangladesh.vercel.app',
    'https://babai-admin.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Database Connection
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB Connected Successfully");
        });
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Initialize Connections
connectDB();
connectCloudinary();

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', categoryRouter);
app.use('/api/feature', featureRouter);
app.use('/api/config', configRouter);
app.use('/api/pages', pageRouter);
app.use('/api/contact', contactRouter); 
app.use('/api/dashboard', dashboardRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});