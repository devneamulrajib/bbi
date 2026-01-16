import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    // --- WEBSITE LOGO ---
    logo: { type: String, default: "" },

    // --- NEW: TOP NOTIFICATION BAR ---
    notification: {
        text: { type: String, default: "Due to the COVID 19 epidemic, orders may be processed with a slight delay" },
        isActive: { type: Boolean, default: true }
    },

    // --- NEW: HERO SLIDER (3 Slides) ---
    heroSlider: {
        interval: { type: Number, default: 5000 }, // Time in ms
        slide1: { 
            image: { type: String, default: "" }, 
            buttonText: { type: String, default: "Shop Now" }, 
            link: { type: String, default: "/collection" } 
        },
        slide2: { 
            image: { type: String, default: "" }, 
            buttonText: { type: String, default: "Shop Now" }, 
            link: { type: String, default: "/collection" } 
        },
        slide3: { 
            image: { type: String, default: "" }, 
            buttonText: { type: String, default: "Shop Now" }, 
            link: { type: String, default: "/collection" } 
        }
    },

    // --- HOT PRODUCT SECTION ---
    hotProduct: {
        productId: { type: String, default: "" },
        endDate: { type: String, default: "" },
        isActive: { type: Boolean, default: true }
    },

    // --- CUSTOMER COMMENT SECTION ---
    testimonial: {
        name: { type: String, default: "" },
        role: { type: String, default: "" },
        desc: { type: String, default: "" },
        image: { type: String, default: "" }
    },

    // --- BOTTOM BANNERS ---
    banner1: { image: { type: String, default: "" }, link: { type: String, default: "" } },
    banner2: { image: { type: String, default: "" }, link: { type: String, default: "" } },

    // --- FOOTER LINKS & INFO ---
    footer: {
        phone: { type: String, default: "" },
        playStore: { type: String, default: "" },
        appStore: { type: String, default: "" },
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        tiktok: { type: String, default: "" }
    },

    // --- DELIVERY SETTINGS ---
    delivery: {
        fee: { type: Number, default: 10 }, // Flat Charge
        freeDeliveryThreshold: { type: Number, default: 200 } // Free if order > 200
    }
});

const configModel = mongoose.models.config || mongoose.model("config", configSchema);
export default configModel;