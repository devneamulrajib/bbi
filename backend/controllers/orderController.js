import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear User Cart after order is placed
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All Orders data for Admin Panel (Sorted Newest First)
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// User Order Data for Frontend (Sorted Newest First)
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status OR Payment Status from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status, payment } = req.body;
        
        let updateData = {};
        
        // Update Order Status (e.g., Shipped, Delivered)
        if (status) {
            updateData.status = status;
        }

        // Update Payment Status (e.g., Paid/Unpaid)
        // We check for undefined because payment can be 'false'
        if (payment !== undefined) {
            updateData.payment = payment;
        }

        await orderModel.findByIdAndUpdate(orderId, updateData);
        res.json({ success: true, message: 'Status Updated' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Delete Order (Admin Only)
const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        await orderModel.findByIdAndDelete(orderId);
        res.json({ success: true, message: "Order Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { placeOrder, allOrders, userOrders, updateStatus, deleteOrder };