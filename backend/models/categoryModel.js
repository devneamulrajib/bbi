import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subCategories: { type: Array, required: true } // Stores ["Topwear", "Bottomwear"] etc.
})

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);
export default categoryModel;