const Payment = require("../models/payment");

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
