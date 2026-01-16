import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    discount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }, // Average Rating
    inStock: { type: Boolean, default: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    date: { type: Number, required: true },
    
    // --- NEW: REVIEWS ARRAY ---
    reviews: [{
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Number, default: Date.now }
    }]
}, { minimize: false })

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;