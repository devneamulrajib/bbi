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

// App Config
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// --- UPDATED CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',           // Vite Localhost
    'http://localhost:5174',           // Vite Admin Localhost
    'http://localhost:3000',           // CRA Localhost
    'https://babaibangladesh.com',     // Your Custom Domain
    'https://www.babaibangladesh.com', // Your Custom Domain (www)
    'https://babaibangladesh.vercel.app', // Your Vercel Frontend
    // 👇 CRITICAL: Add your Admin Vercel Link here (Check Vercel for the exact link)
    'https://babai-admin.vercel.app', 
    'https://admin.babaibangladesh.com'
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

// API Endpoints (Duplicates removed)
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/category', categoryRouter);
app.use('/api/feature', featureRouter);
app.use('/api/config', configRouter);
app.use('/api/pages', pageRouter); 

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});