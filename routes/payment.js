const express = require("express");
const router = express.Router();

const { savepayment, pendingpay, fixpay } = require("../controllers/payment");

router.post("/savepayment", savepayment);
router.post("/pendingpay", pendingpay);
router.post("/fixpay/:data", fixpay);

module.exports = router;
