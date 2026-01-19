import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" }, 
    phone: { type: String, default: "" },   
    // Address is an object, defaults handled in controller/frontend
    address: { type: Object, default: { country: 'Bangladesh' } }, 
    role: { type: String, default: 'User' },
    cartData: { type: Object, default: {} },
    wishlist: { type: Array, default: [] },
    orders: { type: Array, default: [] },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;