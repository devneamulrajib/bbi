import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js"; 

// --- ADD PRODUCT ---
const addProduct = async (req, res) => {
    try {
        const { 
            name, description, price, oldPrice, discount, rating, inStock,
            category, subCategory, sizes, 
            bestseller, trending, newArrival 
        } = req.body;

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

// --- UPDATE PRODUCT ---
const updateProduct = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        
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

// --- ADD REVIEW (User) ---
const addReview = async (req, res) => {
    try {
        const { userId, productId, rating, comment, userName } = req.body;

        // 1. Verify Purchase
        const orders = await orderModel.find({ userId, status: 'Delivered' });
        
        let hasPurchased = false;
        if (orders) {
            orders.forEach(order => {
                order.items.forEach(item => {
                    if (item._id === productId) hasPurchased = true;
                });
            });
        }

        if (!hasPurchased) {
            return res.json({ success: false, message: "Purchase Verification Failed: You must buy and receive this product to review it." });
        }

        const product = await productModel.findById(productId);
        
        // 2. Add Review
        const newReview = { userId, userName, rating: Number(rating), comment, date: Date.now() };
        product.reviews.push(newReview);

        // 3. Recalculate Average Rating
        const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
        product.rating = totalRating / product.reviews.length;

        await product.save();
        res.json({ success: true, message: "Review Added Successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- GET ALL REVIEWS (Admin) ---
const allReviews = async (req, res) => {
    try {
        // Find all products that have at least one review
        const products = await productModel.find({ "reviews.0": { "$exists": true } });
        
        let allReviewsData = [];
        
        // Flatten logic: Extract reviews and attach product info to them
        products.forEach(product => {
            product.reviews.forEach((review, index) => {
                allReviewsData.push({
                    _id: review._id,
                    productId: product._id,
                    productName: product.name,
                    productImage: product.image[0],
                    userId: review.userId,
                    userName: review.userName,
                    rating: review.rating,
                    comment: review.comment,
                    date: review.date,
                    reviewIndex: index // Important for deletion
                });
            });
        });

        res.json({ success: true, reviews: allReviewsData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- DELETE REVIEW (Admin) ---
const deleteReview = async (req, res) => {
    try {
        const { productId, reviewIndex } = req.body;
        const product = await productModel.findById(productId);

        if(!product) return res.json({success:false, message:"Product not found"});

        // Remove review from array
        product.reviews.splice(reviewIndex, 1);

        // Recalculate Rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((acc, item) => acc + item.rating, 0);
            product.rating = totalRating / product.reviews.length;
        } else {
            product.rating = 0;
        }

        await product.save();
        res.json({ success: true, message: "Review Deleted" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    addProduct, 
    listProducts, 
    removeProduct, 
    singleProduct, 
    updateProduct, 
    addReview, 
    allReviews, // Exporting this is crucial for Admin Panel
    deleteReview 
};