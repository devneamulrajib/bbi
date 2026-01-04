import configModel from "../models/configModel.js";
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
            // Footer (NEW)
            phone, playStore, appStore, facebook, instagram, tiktok
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

        // 4. Update Footer (NEW)
        if(phone) config.footer.phone = phone;
        if(playStore) config.footer.playStore = playStore;
        if(appStore) config.footer.appStore = appStore;
        if(facebook) config.footer.facebook = facebook;
        if(instagram) config.footer.instagram = instagram;
        if(tiktok) config.footer.tiktok = tiktok;

        // 5. Handle Images (Safe Check)
        // We use 'req.files && ...' to ensure it doesn't crash if no files are uploaded
        const tImage = req.files && req.files.tImage && req.files.tImage[0];
        const b1Image = req.files && req.files.b1Image && req.files.b1Image[0];
        const b2Image = req.files && req.files.b2Image && req.files.b2Image[0];

        if(tImage) {
            const result = await cloudinary.uploader.upload(tImage.path, { resource_type: 'image' });
            config.testimonial.image = result.secure_url;
        }
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

export { getConfig, updateConfig };