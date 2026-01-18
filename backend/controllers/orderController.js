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

// --- NEW FUNCTION: Dashboard Stats ---
const adminDashboard = async (req, res) => {
    try {
        const orders = await orderModel.find({});

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        // Status Counts
        // Note: Adjust the status strings ('Order Placed', 'Packing') to match what you use in your app
        const pendingOrders = orders.filter(o => 
            o.status === 'Order Placed' || o.status === 'Pending' || o.status === undefined
        ).length;
        
        const processingOrders = orders.filter(o => 
            o.status === 'Processing' || o.status === 'Packing' || o.status === 'Shipped'
        ).length;
        
        const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

        // Today's Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
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

            // Filter orders for this specific day
            const dailyRevenue = orders
                .filter(o => o.date >= dayStart && o.date < dayEnd)
                .reduce((acc, o) => acc + (o.amount || 0), 0);

            salesData.push({
                name: d.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon", "Tue"
                date: d.toISOString().split('T')[0],
                sales: dailyRevenue
            });
        }

        // Best Selling Products
        let productMap = {};
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    // Use item name as key
                    const key = item.name; 
                    if (!productMap[key]) {
                        productMap[key] = { name: key, count: 0, revenue: 0 };
                    }
                    productMap[key].count += (item.quantity || 1);
                    productMap[key].revenue += ((item.price || 0) * (item.quantity || 1));
                });
            }
        });

        // Convert object to array, sort by count desc, take top 5
        const bestSellers = Object.values(productMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Recent Orders (Last 5)
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

export { placeOrder, allOrders, userOrders, updateStatus, deleteOrder, adminDashboard };