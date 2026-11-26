
const express = require("express");
const { handleStripeWebhook } = require("../controllers/webhookController");

const router = express.Router();

router.post("/stripe", handleStripeWebhook);

module.exports = router;
