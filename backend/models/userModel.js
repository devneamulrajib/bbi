import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // <--- New
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    // Store default address to pre-fill checkout
    address: { 
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zipcode: { type: String, default: '' },
        country: { type: String, default: '' }
    },
    role: { type: String, default: 'user' },
}, { minimize: false, timestamps: true }); // Timestamps added

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;