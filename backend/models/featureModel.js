import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
    image: { type: String, required: true }, // The Banner Image
    redirectUrl: { type: String, default: "" } // Where it goes when clicked
})

const featureModel = mongoose.models.feature || mongoose.model("feature", featureSchema);
export default featureModel;