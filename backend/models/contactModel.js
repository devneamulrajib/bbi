import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    date: { type: Number, required: true },
    read: { type: Boolean, default: false } // <--- ADD THIS LINE
});

const contactModel = mongoose.models.contact || mongoose.model("contact", contactSchema);
export default contactModel;