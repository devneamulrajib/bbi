import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['CEO', 'Admin', 'Manager', 'Accountant', 'Deliveryman', 'Moderator'] 
    },
    image: { type: String, default: "" },
    date: { type: Number, default: Date.now() }
}, { minimize: false });

const staffModel = mongoose.models.staff || mongoose.model("staff", staffSchema);
export default staffModel;