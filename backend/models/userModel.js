import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" }, 
    phone: { type: String, default: "" },   // Make sure phone is here
    address: { type: Object, default: {} },
    role: { type: String, default: 'User' }, // <--- YOU MUST ADD THIS LINE
    cartData: { type: Object, default: {} },
    wishlist: { type: Array, default: [] }, // Wishlist array
    orders: { type: Array, default: [] },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;