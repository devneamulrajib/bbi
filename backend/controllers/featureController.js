import featureModel from "../models/featureModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add or Update the Feature Poster
const updateFeature = async (req, res) => {
    try {
        const { redirectUrl } = req.body;
        const image = req.file;

        let feature = await featureModel.findOne({});
        let imageUrl = feature ? feature.image : "";

        // If new image uploaded, send to Cloudinary
        if (image) {
            const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
            imageUrl = result.secure_url;
        }

        if (feature) {
            // Update existing
            feature.redirectUrl = redirectUrl || "";
            if(image) feature.image = imageUrl;
            await feature.save();
        } else {
            // Create new
            if(!imageUrl) return res.json({success:false, message: "Image required for first time"});
            const newFeature = new featureModel({
                redirectUrl: redirectUrl || "", 
                image: imageUrl
            })
            await newFeature.save();
        }

        res.json({ success: true, message: "Banner Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get Feature Poster
const getFeature = async (req, res) => {
    try {
        const feature = await featureModel.findOne({});
        res.json({ success: true, feature });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { updateFeature, getFeature };