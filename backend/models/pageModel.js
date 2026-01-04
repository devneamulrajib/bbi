import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // e.g., 'privacy-policy'
    title: { type: String, required: true },
    content: { type: String, default: "" }
});

const pageModel = mongoose.models.page || mongoose.model("page", pageSchema);
export default pageModel;