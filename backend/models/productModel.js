import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number }, // Original Price (for strike-through)
    discount: { type: Number, default: 0 }, // % OFF
    rating: { type: Number, default: 0 }, // 1-5 Stars
    inStock: { type: Boolean, default: true },
    
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    sizes: { type: Array, required: true },
    
    // Flags
    bestseller: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },   // <--- NEW
    newArrival: { type: Boolean, default: false }, // <--- NEW
    
    date: { type: Number, required: true }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;