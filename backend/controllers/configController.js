import configModel from "../models/configModel.js";
import promoModel from "../models/promoModel.js"; 
import { v2 as cloudinary } from "cloudinary";

// Get Configuration (Frontend & Admin)
const getConfig = async (req, res) => {
    try {
        let config = await configModel.findOne({});
        if (!config) {
            config = new configModel();
            await config.save();
        }
        res.json({ success: true, config });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- CHECK PROMO (Public) ---
const checkPromo = async (req, res) => {
    try {
        const { code } = req.body;
        const promo = await promoModel.findOne({ code: code.toUpperCase() });
        
        if (!promo) {
            return res.json({ success: false, message: "Invalid Coupon Code" });
        }
        if (!promo.isActive) {
            return res.json({ success: false, message: "Coupon Expired" });
        }

        res.json({ success: true, promo: { code: promo.code, value: promo.value, type: promo.discountType } });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Configuration (Admin)
const updateConfig = async (req, res) => {
    try {
        const { 
            // Hot Product
            hotProductId, hotEndDate, hotIsActive, 
            // Testimonial
            tName, tRole, tDesc, 
            // Banners
            b1Link, b2Link,
            // Footer
            phone, playStore, appStore, facebook, instagram, tiktok,
            // Delivery Settings
            deliveryFee, freeDeliveryThreshold
        } = req.body;
        
        let config = await configModel.findOne({});
        if(!config) config = new configModel();

        // 1. Update Hot Product
        if(hotProductId !== undefined) config.hotProduct.productId = hotProductId;
        if(hotEndDate !== undefined) config.hotProduct.endDate = hotEndDate;
        if(hotIsActive !== undefined) config.hotProduct.isActive = hotIsActive === "true";

        // 2. Update Testimonial Text
        if(tName) config.testimonial.name = tName;
        if(tRole) config.testimonial.role = tRole;
        if(tDesc) config.testimonial.desc = tDesc;

        // 3. Update Banner Links
        if(b1Link) config.banner1.link = b1Link;
        if(b2Link) config.banner2.link = b2Link;

        // 4. Update Footer
        if(phone) config.footer.phone = phone;
        if(playStore) config.footer.playStore = playStore;
        if(appStore) config.footer.appStore = appStore;
        if(facebook) config.footer.facebook = facebook;
        if(instagram) config.footer.instagram = instagram;
        if(tiktok) config.footer.tiktok = tiktok;

        // 5. Update Delivery Settings
        if(deliveryFee !== undefined) config.delivery.fee = Number(deliveryFee);
        if(freeDeliveryThreshold !== undefined) config.delivery.freeDeliveryThreshold = Number(freeDeliveryThreshold);

        // 6. Handle Images (Including LOGO)
        // Using optional chaining/checks to prevent crashes if files aren't uploaded
        const logo = req.files && req.files.logo && req.files.logo[0]; // <--- LOGO
        const tImage = req.files && req.files.tImage && req.files.tImage[0];
        const b1Image = req.files && req.files.b1Image && req.files.b1Image[0];
        const b2Image = req.files && req.files.b2Image && req.files.b2Image[0];

        // Upload Logo
        if(logo) {
            const result = await cloudinary.uploader.upload(logo.path, { resource_type: 'image' });
            config.logo = result.secure_url;
        }

        // Upload Testimonial Image
        if(tImage) {
            const result = await cloudinary.uploader.upload(tImage.path, { resource_type: 'image' });
            config.testimonial.image = result.secure_url;
        }

        // Upload Banner Images
        if(b1Image) {
            const result = await cloudinary.uploader.upload(b1Image.path, { resource_type: 'image' });
            config.banner1.image = result.secure_url;
        }
        if(b2Image) {
            const result = await cloudinary.uploader.upload(b2Image.path, { resource_type: 'image' });
            config.banner2.image = result.secure_url;
        }

        await config.save();
        res.json({ success: true, message: "Settings Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- PROMO CODE CONTROLLERS ---

const addPromo = async (req, res) => {
    try {
        const { code, type, value } = req.body;
        const newPromo = new promoModel({ code, discountType: type, value });
        await newPromo.save();
        res.json({ success: true, message: "Promo Code Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const listPromos = async (req, res) => {
    try {
        const promos = await promoModel.find({});
        res.json({ success: true, promos });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const deletePromo = async (req, res) => {
    try {
        const { id } = req.body;
        await promoModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Promo Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getConfig, updateConfig, addPromo, listPromos, deletePromo, checkPromo };