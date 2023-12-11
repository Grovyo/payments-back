const Payment = require("../models/payment");
const Pendingpay = require("../models/pendingpay");
const Enc = require("../utils/enc");

exports.savepayment = async (req, res) => {
  const {
    origin,
    message,
    vpa,
    recievingbank,
    amount,
    time,
    upiref,
    status,
    action,
  } = req.body;

  try {
    const payment = new Payment({
      origin,
      recievingbank,
      amount,
      time,
      upiref,
      status,
      action,
      vpa,
      message,
    });
    await payment.save();
    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message, success: false });
  }
};

exports.pendingpay = async (req, res) => {
  const { data } = req.body;
  const a = await Enc.decryptaes(data);
  console.log(a, dec);
  try {
    const payment = new Pendingpay({
      amount: a.amount,
      time: a.time,
      userid: a.userid,
      status: "pending",
    });
    await payment.save();
    res.status(200).json({ success: true, p: payment._id });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message, success: false });
  }
};

exports.fixpay = async (req, res) => {
  const { data } = req.params;
  const a = await Enc.decryptaes(data);
  console.log(a, dec);
  try {
    await Pendingpay.updateOne(
      { _id: data.id },
      { $set: { status: "success" } }
    );

    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message, success: false });
  }
};
