import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// --- ADD PRODUCT ---
const addProduct = async (req, res) => {
    try {
        const { 
            name, description, price, oldPrice, discount, rating, inStock,
            category, subCategory, sizes, 
            bestseller, trending, newArrival 
        } = req.body;

        // Image Upload Logic
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
            name, description, category, 
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : 0,
            discount: discount ? Number(discount) : 0,
            rating: rating ? Number(rating) : 0,
            inStock: inStock === "true" ? true : false,
            subCategory: subCategory || "",
            sizes: JSON.parse(sizes),
            
            // Flags
            bestseller: bestseller === "true",
            trending: trending === "true",
            newArrival: newArrival === "true",
            
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- UPDATE PRODUCT (NEW) ---
const updateProduct = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        
        // Convert strings to booleans/numbers where needed
        if(updateData.sizes) updateData.sizes = JSON.parse(updateData.sizes);
        if(updateData.price) updateData.price = Number(updateData.price);
        
        await productModel.findByIdAndUpdate(id, updateData);
        res.json({ success: true, message: "Product Updated" });
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

// --- REMOVE PRODUCT ---
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
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

export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };