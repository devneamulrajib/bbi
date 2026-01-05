import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    // --- NEW: LOGO FIELD ---
    logo: { type: String, default: "" },

    // Hot Product Section
    hotProduct: {
        productId: { type: String, default: "" },
        endDate: { type: String, default: "" },
        isActive: { type: Boolean, default: true }
    },

    // Customer Comment Section
    testimonial: {
        name: { type: String, default: "" },
        role: { type: String, default: "" },
        desc: { type: String, default: "" },
        image: { type: String, default: "" }
    },

    // Banners
    banner1: { image: { type: String, default: "" }, link: { type: String, default: "" } },
    banner2: { image: { type: String, default: "" }, link: { type: String, default: "" } },

    // Footer Links & Info
    footer: {
        phone: { type: String, default: "" },
        playStore: { type: String, default: "" },
        appStore: { type: String, default: "" },
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        tiktok: { type: String, default: "" }
    },

    // Delivery Settings
    delivery: {
        fee: { type: Number, default: 10 }, // Flat Charge
        freeDeliveryThreshold: { type: Number, default: 200 } // Free if order > 200
    }
});

const configModel = mongoose.models.config || mongoose.model("config", configSchema);
export default configModel;