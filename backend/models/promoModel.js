import mongoose from "mongoose";

const promoSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, default: "percent" }, // 'percent' or 'flat'
    value: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
});

const promoModel = mongoose.models.promo || mongoose.model("promo", promoSchema);
export default promoModel;