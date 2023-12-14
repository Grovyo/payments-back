const Payment = require("../models/payment");
const Pendingpay = require("../models/pendingpay");

const aesjs = require("aes-js");

const decryptaes = (data) => {
  try {
    const encryptedBytes = aesjs.utils.hex.toBytes(data);
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      JSON.parse(process.env.KEY),
      new aesjs.Counter(5)
    );
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
  } catch (e) {
    console.log(e);
  }
};

const encryptaes = (data) => {
  try {
    const textBytes = aesjs.utils.utf8.toBytes(data);
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      JSON.parse(process.env.KEY),
      new aesjs.Counter(5)
    );
    const encryptedBytes = aesCtr.encrypt(textBytes);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
  } catch (e) {
    console.log(e);
  }
};

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
  const d = await decryptaes(data);
  let a = JSON.parse(d);
  try {
    const payment = new Pendingpay({
      amount: a.amount,
      time: a.time,
      userid: a.userid,
      status: "pending",
      from: a.from,
      email: a?.email,
      upi: a?.upi,
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
  const a = await decryptaes(data);
  console.log(a, "dec");
  try {
    await Pendingpay.updateOne({ _id: a.id }, { $set: { status: "success" } });

    res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message, success: false });
  }
};
