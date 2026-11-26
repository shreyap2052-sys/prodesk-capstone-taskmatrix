
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createCheckoutSession } = require("../controllers/paymentController");

const router = express.Router();

router.post("/:invoiceId/checkout", protect, createCheckoutSession);

module.exports = router;
