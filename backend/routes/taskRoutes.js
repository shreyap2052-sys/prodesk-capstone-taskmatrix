const express = require("express");

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  taskSchema,
  updateTaskSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post("/", protect, validate(taskSchema), createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;
