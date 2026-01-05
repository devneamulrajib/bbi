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
        let { email, password } = req.body; 
        
        // 1. Clean inputs (remove spaces)
        email = email.trim(); 
        password = password.trim();

        console.log(`Login Attempt -> Input: ${email}, Password: ${password}`);

        // 2. Find user by Email OR Phone
        // Note: We use a case-insensitive regex for email to avoid "User@test.com" vs "user@test.com" issues
        const user = await userModel.findOne({ 
            $or: [ 
                { email: { $regex: new RegExp(`^${email}$`, 'i') } }, 
                { phone: email } 
            ] 
        });

        if (!user) {
            console.log("❌ Login Failed: User not found in database");
            return res.json({ success: false, message: "User doesn't exist" });
        }

        // 3. Check Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log("✅ Login Success:", user.name);
            const token = createToken(user._id);
            res.json({ success: true, token });
        } else {
            console.log("❌ Login Failed: Incorrect Password");
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log("Server Error during Login:", error);
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
        if (password.length < 8) return res.json({ success: false, message: "Weak password (min 8 chars)" });

        // Hash
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
        const { userId } = req.body; 
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

// Admin Login
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

// Admin Management Functions
const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        await userModel.findByIdAndDelete(id);
        res.json({ success: true, message: "User Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const getSingleUser = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await userModel.findById(id).select('-password');
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const adminManageUser = async (req, res) => {
    try {
        const { id, name, email, phone, password, street, city, state, zipcode, country } = req.body;
        const address = { street, city, state, zipcode, country };

        if (id) {
            const updateData = { name, email, phone, address };
            if (password && password.length > 0) {
                if (password.length < 8) return res.json({ success: false, message: "Password too short" });
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            }
            await userModel.findByIdAndUpdate(id, updateData);
            res.json({ success: true, message: "User Updated Successfully" });
        } else {
            const exists = await userModel.findOne({ email });
            if (exists) return res.json({ success: false, message: "User already exists" });
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = new userModel({ name, email, phone, password: hashedPassword, address });
            await newUser.save();
            res.json({ success: true, message: "User Created Successfully" });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile, updateProfile, allUsers, deleteUser, getSingleUser, adminManageUser };