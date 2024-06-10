import mongoose, { Schema } from "mongoose";
const couponSchema = mongoose.Schema({
  coupon_code: {
    type: "string",
    required: true,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  description: {
    type: "string",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const couponModel = new mongoose.model("coupon", couponSchema);

export default couponModel;
