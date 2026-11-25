const express = require("express");

const { generateTask } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { aiLimiter } = require("../middleware/rateLimiter");
const { aiSchema } = require("../validators/requestSchemas");

const router = express.Router();

router.post("/generate-task", protect, aiLimiter, validate(aiSchema), generateTask);

module.exports = router;
