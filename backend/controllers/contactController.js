import contactModel from "../models/contactModel.js";
import contactSettingsModel from "../models/contactSettingsModel.js";

// --- MESSAGES LOGIC ---

// 1. Submit Message (Public)
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const newContact = new contactModel({ name, email, phone, message, date: Date.now() });
        await newContact.save();
        res.json({ success: true, message: "Message Sent Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 2. Get All Messages (Admin)
const getAllMessages = async (req, res) => {
    try {
        const messages = await contactModel.find({}).sort({ date: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 3. Delete Message (Admin)
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.body;
        await contactModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Message Deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// --- SETTINGS LOGIC (Address, Phone, Email) ---

// 4. Get Contact Settings (Public & Admin)
const getContactSettings = async (req, res) => {
    try {
        let settings = await contactSettingsModel.findOne({});
        if (!settings) {
            // Create default if not exists
            settings = await contactSettingsModel.create({});
        }
        res.json({ success: true, settings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// 5. Update Contact Settings (Admin)
const updateContactSettings = async (req, res) => {
    try {
        const { address, email, phone } = req.body;
        // Upsert: Update if exists, Create if not
        await contactSettingsModel.findOneAndUpdate({}, { address, email, phone }, { upsert: true, new: true });
        res.json({ success: true, message: "Contact Info Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

const markAllRead = async (req, res) => {
    try {
        await contactModel.updateMany({}, { read: true });
        res.json({ success: true, message: "All marked as read" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export { submitContact, getAllMessages, deleteMessage, getContactSettings, updateContactSettings, markAllRead  };