import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Route for User Login (Email OR Phone)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' here acts as "Email or Phone" input

        // Check if input matches an email or a phone number
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

// Route for User Registration (Detailed)
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;

        // Check exists
        const exists = await userModel.findOne({ email });
        if (exists) return res.json({ success: false, message: "User already exists" });

        // Validations
        if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
        if (password.length < 8) return res.json({ success: false, message: "Weak password" });

        // Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, phone,
            password: hashedPassword,
            address: address || {} // Expecting object { street, city, zip... }
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get User Profile Data
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body; // From middleware
        const user = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData: user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update User Profile
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

// Admin Login (No change)
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

export { loginUser, registerUser, adminLogin, getUserProfile, updateProfile };