import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// --- ADD PRODUCT ---
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        const productData = {
            name, description, category, price: Number(price), 
            subCategory: subCategory || "", bestseller: bestseller === "true", 
            sizes: JSON.parse(sizes), image: imagesUrl, date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- LIST PRODUCTS ---
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- REMOVE PRODUCT (DEBUG VERSION) ---
const removeProduct = async (req, res) => {
    // 1. Log that we reached the controller
    console.log("------------------------------------------");
    console.log("🔴 DELETE REQUEST RECEIVED");
    console.log("🔹 Request Body:", req.body);

    try {
        // 2. Validate ID
        if (!req.body.id) {
            console.log("❌ Error: No ID provided");
            return res.json({ success: false, message: "No ID provided" });
        }

        // 3. Attempt Delete
        console.log("🔹 Attempting to delete from MongoDB...");
        const deleteResult = await productModel.findByIdAndDelete(req.body.id);
        
        console.log("🔹 MongoDB Result:", deleteResult);

        if (deleteResult) {
            console.log("✅ SUCCESS: Product deleted.");
            res.json({ success: true, message: "Product Deleted" });
        } else {
            console.log("⚠️ WARNING: Product ID not found in DB (Already deleted?)");
            // We return true anyway so the Frontend removes it from the list
            res.json({ success: true, message: "Product was not found, but list updated." });
        }

    } catch (error) {
        console.log("❌ CRITICAL ERROR:", error);
        res.json({ success: false, message: error.message });
    }
}

// --- SINGLE PRODUCT ---
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct };