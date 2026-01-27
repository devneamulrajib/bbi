import contactModel from "../models/contactModel.js";
import orderModel from "../models/orderModel.js"; // Ensure you have this

// Get Counts for Sidebar Badges
const getDashboardStats = async (req, res) => {
    try {
        // 1. Count Unread Messages
        const unreadMessages = await contactModel.countDocuments({ read: false });

        // 2. Count New Orders (Assuming status 'Order Placed' is the default)
        const newOrders = await orderModel.countDocuments({ status: 'Order Placed' });

        // 3. Count Reviews (If you have a review model, add logic here)
        // const newReviews = await reviewModel.countDocuments({ approved: false });

        res.json({
            success: true,
            stats: {
                messages: unreadMessages,
                orders: newOrders,
                // reviews: newReviews
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { getDashboardStats };