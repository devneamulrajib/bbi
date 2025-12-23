import categoryModel from "../models/categoryModel.js";

// Add a new Category
const addCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;
        
        const exists = await categoryModel.findOne({ name });
        if(exists) {
            return res.json({ success: false, message: "Category already exists" });
        }

        const category = new categoryModel({ 
            name, 
            subCategories: subCategories || [] 
        });
        
        await category.save();
        res.json({ success: true, message: "Category Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List all Categories
const listCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.json({ success: true, categories });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- NEW: Update Category ---
const updateCategory = async (req, res) => {
    try {
        const { id, name, subCategories } = req.body;
        
        await categoryModel.findByIdAndUpdate(id, {
            name,
            subCategories
        });

        res.json({ success: true, message: "Category Updated Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove entire Category
const removeCategory = async (req, res) => {
    try {
        await categoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Category Removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Remove specific SubCategory
const removeSubCategory = async (req, res) => {
    try {
        const { categoryId, subCatName } = req.body;
        await categoryModel.findByIdAndUpdate(categoryId, {
            $pull: { subCategories: subCatName }
        });
        res.json({ success: true, message: "SubCategory Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addCategory, listCategory, removeCategory, removeSubCategory, updateCategory };