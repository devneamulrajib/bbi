import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js"; // OTP Model
import { sendOtpEmail } from "../config/emailConfig.js"; // Brevo Email Helper
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create JWT Token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

// --- 1. SEND OTP ---
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB (upsert, auto-expires 5 mins)
        await otpModel.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send Email (non-blocking)
        const isSent = await sendOtpEmail(email, otp);
        if (!isSent) console.warn("⚠️ OTP email failed, but user can continue signup");

        return res.json({ success: true, message: "OTP sent to your email (or logged if failed)" });

    } catch (error) {
        console.error("Send OTP Error:", error);
        return res.status(500).json({ success: false, message: "Server error while sending OTP" });
    }
};

// --- 2. USER REGISTRATION (VERIFY OTP) ---
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, address, otp } = req.body;

        // 1. Verify OTP
        const otpRecord = await otpModel.findOne({ email });
        if (!otpRecord || otpRecord.otp !== otp) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
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
            name,
            email,
            phone,
            password: hashedPassword,
            address: address || {}
        });

        const user = await newUser.save();

        // 4. Delete Used OTP
        await otpModel.deleteOne({ email });

        const token = createToken(user._id);

        return res.json({ success: true, token, message: "Signup successful" });

    } catch (error) {
        console.error("Register User Error:", error);
        return res.status(500).json({ success: false, message: "Server error during signup" });
    }
};

// --- 3. USER LOGIN ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ $or: [{ email }, { phone: email }] });
        if (!user) return res.json({ success: false, message: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        const token = createToken(user._id);
        return res.json({ success: true, token });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// --- 4. GET PROFILE ---
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId).select("-password");
        return res.json({ success: true, userData: user });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- 5. UPDATE PROFILE ---
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, password } = req.body;
        const updateData = { name, phone, address };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await userModel.findByIdAndUpdate(userId, updateData);
        return res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- 6. TOGGLE WISHLIST ---
const toggleWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const user = await userModel.findById(userId);

        if (user.wishlist.includes(productId)) {
            user.wishlist = user.wishlist.filter(id => id !== productId);
            await user.save();
            return res.json({ success: true, message: "Removed from wishlist", wishlist: user.wishlist });
        } else {
            user.wishlist.push(productId);
            await user.save();
            return res.json({ success: true, message: "Added to wishlist", wishlist: user.wishlist });
        }

    } catch (error) {
        console.error("Toggle Wishlist Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- 7. ADMIN LOGIN ---
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- 8. ADMIN: LIST / DELETE / GET SINGLE / MANAGE USERS ---
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        return res.json({ success: true, users });
    } catch (error) {
        console.error("All Users Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.findByIdAndDelete(id);
        return res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id).select("-password");
        return res.json({ success: true, user });
    } catch (error) {
        console.error("Get Single User Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const adminManageUser = async (req, res) => {
    try {
        const { id, name, email, phone, password, street, city, state, zipcode, country } = req.body;
        const address = { street, city, state, zipcode, country };

        if (id) {
            // Update existing user
            const updateData = { name, email, phone, address };
            if (password && password.length > 0) {
                if (password.length < 8) return res.json({ success: false, message: "Password too short" });
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }
            await userModel.findByIdAndUpdate(id, updateData);
            return res.json({ success: true, message: "User updated successfully" });
        } else {
            // Create new user
            const exists = await userModel.findOne({ email });
            if (exists) return res.json({ success: false, message: "User already exists" });
            if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
            if (password.length < 8) return res.json({ success: false, message: "Weak password" });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({ name, email, phone, password: hashedPassword, address });

            await newUser.save();
            return res.json({ success: true, message: "User created successfully" });
        }

    } catch (error) {
        console.error("Admin Manage User Error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export {
    sendOtp,
    registerUser,
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
