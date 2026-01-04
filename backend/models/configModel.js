import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    // ... (Keep hotProduct, testimonial, banner1, banner2 as they are) ...
    hotProduct: {
        productId: { type: String, default: "" },
        endDate: { type: String, default: "" }, 
        isActive: { type: Boolean, default: true }
    },
    testimonial: {
        name: { type: String, default: "" },
        role: { type: String, default: "" },
        desc: { type: String, default: "" },
        image: { type: String, default: "" }
    },
    banner1: { image: { type: String, default: "" }, link: { type: String, default: "" } },
    banner2: { image: { type: String, default: "" }, link: { type: String, default: "" } },

    // --- NEW FOOTER SECTION ---
    footer: {
        phone: { type: String, default: "8 800 555-55" },
        playStore: { type: String, default: "" },
        appStore: { type: String, default: "" },
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        tiktok: { type: String, default: "" }
    }
});

const configModel = mongoose.models.config || mongoose.model("config", configSchema);
export default configModel;