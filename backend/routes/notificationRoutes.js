const express = require("express");

const {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { notificationSchema } = require("../validators/requestSchemas");

const router = express.Router();

router.post("/", protect, validate(notificationSchema), createNotification);
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markNotificationAsRead);

module.exports = router;
