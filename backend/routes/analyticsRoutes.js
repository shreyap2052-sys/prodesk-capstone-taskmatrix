const express = require("express");
const { getAnalytics } = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", getAnalytics);

module.exports = router;