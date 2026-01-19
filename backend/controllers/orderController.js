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

// Update Order Status OR Payment Status (Used by Admin & Rider)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status, payment } = req.body;
        
        let updateData = {};
        
        if (status) {
            updateData.status = status;
        }

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

// --- NEW FUNCTION: Mark Payment as Collected (For Rider) ---
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        res.json({ success: true, message: "Payment Collected" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- NEW FUNCTION: Get Orders for Rider Dashboard ---
const getRiderOrders = async (req, res) => {
    try {
        // NOTE: In a real app, you would filter by the Rider's ID: 
        // const { userId } = req.body; 
        // const orders = await orderModel.find({ riderId: userId });
        
        // FOR NOW: We return ALL orders so you can see data in your Rider App immediately.
        const orders = await orderModel.find({}).sort({ date: -1 });
        
        res.json({ success: true, orders });
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

// --- Dashboard Stats (For Admin) ---
const adminDashboard = async (req, res) => {
    try {
        const orders = await orderModel.find({});

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        // Status Counts
        const pendingOrders = orders.filter(o => 
            o.status === 'Order Placed' || o.status === 'Pending' || o.status === undefined
        ).length;
        
        const processingOrders = orders.filter(o => 
            o.status === 'Processing' || o.status === 'Packing' || o.status === 'Shipped' || o.status === 'Out for delivery'
        ).length;
        
        const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

        // Today's Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const todayTimestamp = today.getTime();

        const todaysOrders = orders.filter(o => o.date >= todayTimestamp);
        const todaysRevenue = todaysOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const todaysCount = todaysOrders.length;

        // Sales Chart Data (Last 7 Days)
        const salesData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            
            const dayStart = d.getTime();
            const dayEnd = dayStart + (24 * 60 * 60 * 1000);

            const dailyRevenue = orders
                .filter(o => o.date >= dayStart && o.date < dayEnd)
                .reduce((acc, o) => acc + (o.amount || 0), 0);

            salesData.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }), 
                date: d.toISOString().split('T')[0],
                sales: dailyRevenue
            });
        }

        // Best Selling Products
        let productMap = {};
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const key = item.name; 
                    if (!productMap[key]) {
                        productMap[key] = { name: key, count: 0, revenue: 0 };
                    }
                    productMap[key].count += (item.quantity || 1);
                    productMap[key].revenue += ((item.price || 0) * (item.quantity || 1));
                });
            }
        });

        const bestSellers = Object.values(productMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Recent Orders
        const recentOrders = [...orders]
            .sort((a, b) => b.date - a.date)
            .slice(0, 5);

        res.json({
            success: true,
            stats: {
                totalOrders,
                totalRevenue,
                pendingOrders,
                processingOrders,
                deliveredOrders,
                todaysRevenue,
                todaysCount
            },
            salesData,
            bestSellers,
            recentOrders
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    placeOrder, 
    allOrders, 
    userOrders, 
    updateStatus, 
    deleteOrder, 
    adminDashboard,
    getRiderOrders,      // Added
    updatePaymentStatus  // Added
};