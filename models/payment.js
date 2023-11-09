const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const paymentSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

paymentSchema.index({ title: "text" });

module.exports = mongoose.model("Payment", paymentSchema);
