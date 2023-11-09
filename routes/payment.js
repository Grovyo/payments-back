const express = require("express");
const router = express.Router();

const { savepayment } = require("../controllers/payment");

router.post("/savepayment", savepayment);

module.exports = router;
