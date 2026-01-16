import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    address: { type: Object, default: { street:'', city:'', state:'', zipcode:'', country:'' } },
    role: { type: String, default: 'user' },
    
    // --- NEW: WISHLIST ---
    wishlist: { type: Array, default: [] } 

}, { minimize: false, timestamps: true });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;