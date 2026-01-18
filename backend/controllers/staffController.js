import staffModel from "../models/staffModel.js";
import orderModel from "../models/orderModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- STAFF MANAGEMENT ---

// 1. Add Staff (Only Super Admin/CEO/Admin can do this)
const addStaff = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;
        
        const exists = await staffModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "Staff email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newStaff = new staffModel({ name, email, password: hashedPassword, phone, role });
        await newStaff.save();

        res.json({ success: true, message: `${role} Added Successfully` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// 2. Get All Staff
const getAllStaff = async (req, res) => {
    try {
        const staff = await staffModel.find({}).select("-password");
        res.json({ success: true, staff });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. Delete Staff
const deleteStaff = async (req, res) => {
    try {
        await staffModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Staff member removed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- LOGIN (Unified Admin Login) ---
// Checks .env Super Admin FIRST, then checks Staff DB
const staffLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check Super Admin (.env)
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'Super Admin' }, process.env.JWT_SECRET);
            return res.json({ success: true, token, role: 'Super Admin' });
        }

        // 2. Check Staff DB
        const staff = await staffModel.findOne({ email });
        if (staff) {
            const isMatch = await bcrypt.compare(password, staff.password);
            if (isMatch) {
                const token = jwt.sign({ id: staff._id, role: staff.role }, process.env.JWT_SECRET);
                return res.json({ success: true, token, role: staff.role });
            }
        }

        return res.json({ success: false, message: "Invalid credentials" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- RIDER FUNCTIONS ---

// 1. Get Orders Assigned to Specific Rider
const getRiderOrders = async (req, res) => {
    try {
        const { riderId } = req.body; // Comes from middleware
        // Find orders where rider field matches this rider's ID
        const orders = await orderModel.find({ rider: riderId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 2. Rider Updates Status (Picked Up / Delivered)
const updateRiderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        // Rider can only set specific statuses
        if (['Shipped', 'Out for delivery', 'Delivered', 'Returned'].includes(status)) {
            await orderModel.findByIdAndUpdate(orderId, { status });
            return res.json({ success: true, message: "Status Updated" });
        }
        res.json({ success: false, message: "Invalid Status for Rider" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. Rider Collects Money (Mark as Paid)
const markOrderPaid = async (req, res) => {
    try {
        const { orderId } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        res.json({ success: true, message: "Payment Collected" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 4. Admin Assigns Rider
const assignRider = async (req, res) => {
    try {
        const { orderId, riderId } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { rider: riderId, status: 'Shipped' }); 
        res.json({ success: true, message: "Rider Assigned & Status set to Shipped" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { addStaff, getAllStaff, deleteStaff, staffLogin, getRiderOrders, updateRiderStatus, markOrderPaid, assignRider }