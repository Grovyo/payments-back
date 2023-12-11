const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pendingpay = new mongoose.Schema(
  {
    recievingbank: { type: String },
    amount: { type: Number, default: 0 },
    time: { type: String },
    upiref: { type: String },
    status: { type: String, default: "pending" },
    action: { type: String },
    origin: { type: String },
    vpa: { type: String },
    message: { type: String },
    userid: { type: String },
  },
  { timestamps: true }
);

pendingpay.index({ title: "text" });

module.exports = mongoose.model("pendingpay", pendingpay);
