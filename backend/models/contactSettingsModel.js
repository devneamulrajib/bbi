import mongoose from "mongoose";

const contactSettingsSchema = new mongoose.Schema({
    address: { type: String, default: "123 Grocery St, New York, USA" },
    email: { type: String, default: "support@bacola.com" },
    phone: { type: String, default: "+1 234 567 890" }
});

// We use a singleton pattern (one document) for settings
const contactSettingsModel = mongoose.models.contactSettings || mongoose.model("contactSettings", contactSettingsSchema);
export default contactSettingsModel;