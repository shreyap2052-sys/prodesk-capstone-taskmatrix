const express = require("express");

const {
  createActivity,
  getActivities,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { activitySchema } = require("../validators/requestSchemas");

const router = express.Router();

router.post("/", protect, validate(activitySchema), createActivity);
router.get("/", protect, getActivities);

module.exports = router;
