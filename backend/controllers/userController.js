import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js"; // <--- Import OTP Model
import { sendOtpEmail } from "../config/emailConfig.js"; // <--- Import Email Helper
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// --- 1. SEND OTP (NEW) ---
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (Update if exists, auto-expires in 5 mins)
        await otpModel.findOneAndUpdate(
            { email }, 
            { otp, createdAt: Date.now() }, 
            { upsert: true, new: true }
        );

        // Send Email
        const isSent = await sendOtpEmail(email, otp);

        if (isSent) {
            res.json({ success: true, message: "OTP sent to your email" });
        } else {
            res.json({ success: false, message: "Failed to send email" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- 2. USER REGISTRATION (VERIFY OTP) ---
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, address, otp } = req.body;

        // 1. Verify OTP
        const otpRecord = await otpModel.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.json({ success: false, message: "Invalid or Expired OTP" });
        }

        // 2. Standard Validation
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
        if (password.length < 8) return res.json({ success: false, message: "Weak password" });

        // 3. Create User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, phone,
            password: hashedPassword,
            address: address || {}
        });

        const user = await newUser.save();

        // 4. Delete Used OTP
        await otpModel.deleteOne({ email });

        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- USER LOGIN (Email OR Phone) ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ 
            $or: [ { email: email }, { phone: email } ] 
        });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- GET PROFILE ---
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData: user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- UPDATE PROFILE ---
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, password } = req.body;
        const updateData = { name, phone, address };

        if(password) {
             const salt = await bcrypt.genSalt(10);
             updateData.password = await bcrypt.hash(password, salt);
        }

        await userModel.findByIdAndUpdate(userId, updateData);
        res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- TOGGLE WISHLIST ---
const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await userModel.findById(userId);

        if (user.wishlist.includes(productId)) {
            // Remove
            user.wishlist = user.wishlist.filter(id => id !== productId);
            await user.save();
            res.json({ success: true, message: "Removed from Wishlist", wishlist: user.wishlist });
        } else {
            // Add
            user.wishlist.push(productId);
            await user.save();
            res.json({ success: true, message: "Added to Wishlist", wishlist: user.wishlist });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- ADMIN LOGIN ---
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- ADMIN: LIST ALL USERS ---
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- ADMIN: DELETE USER ---
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.findByIdAndDelete(id);
        res.json({ success: true, message: "User Deleted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- ADMIN: GET SINGLE USER ---
const getSingleUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// --- ADMIN: MANAGE USER (ADD/EDIT) ---
const adminManageUser = async (req, res) => {
    try {
        const { id, name, email, phone, password, street, city, state, zipcode, country } = req.body;
        const address = { street, city, state, zipcode, country };

        if (id) {
            // Update
            const updateData = { name, email, phone, address };
            if (password && password.length > 0) {
                if (password.length < 8) return res.json({ success: false, message: "Password too short" });
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }
            await userModel.findByIdAndUpdate(id, updateData);
            res.json({ success: true, message: "User Updated Successfully" });
        } else {
            // Create
            const exists = await userModel.findOne({ email });
            if (exists) return res.json({ success: false, message: "User already exists" });
            if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
            if (password.length < 8) return res.json({ success: false, message: "Weak password" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({ name, email, phone, password: hashedPassword, address });

            await newUser.save();
            res.json({ success: true, message: "User Created Successfully" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    sendOtp, // New
    registerUser, // Updated
    loginUser, 
    getUserProfile, 
    updateProfile, 
    toggleWishlist, 
    adminLogin, 
    allUsers, 
    deleteUser, 
    getSingleUser, 
    adminManageUser 
};