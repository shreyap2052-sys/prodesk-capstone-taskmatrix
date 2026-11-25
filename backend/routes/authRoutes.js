const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const validate = require("../middleware/validate");
const { loginLimiter } = require("../middleware/rateLimiter");
const { registerSchema, loginSchema } = require("../validators/requestSchemas");

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", loginLimiter, validate(loginSchema), loginUser);

module.exports = router;
