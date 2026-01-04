import pageModel from "../models/pageModel.js";

// Get Page (Frontend)
const getPage = async (req, res) => {
    try {
        const { slug } = req.params;
        const page = await pageModel.findOne({ slug });
        if (page) {
            res.json({ success: true, page });
        } else {
            res.json({ success: false, message: "Page not found" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update or Create Page (Admin)
const updatePage = async (req, res) => {
    try {
        const { slug, title, content } = req.body;
        
        // This line finds the page by 'slug'. 
        // If found, it updates it. 
        // If NOT found, it creates a new one (upsert: true).
        const updatedPage = await pageModel.findOneAndUpdate(
            { slug }, 
            { slug, title, content }, 
            { new: true, upsert: true } 
        );

        res.json({ success: true, message: "Content Updated Successfully", page: updatedPage });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { getPage, updatePage };