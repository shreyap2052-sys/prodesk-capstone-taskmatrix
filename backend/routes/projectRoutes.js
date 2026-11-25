const express = require("express");

const {
  createProject,
  getProjects,
  addProjectMember,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  projectSchema,
  addMemberSchema,
  updateProjectSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post("/", protect, validate(projectSchema), createProject);
router.get("/", protect, getProjects);
router.post("/:id/members", protect, validate(addMemberSchema), addProjectMember);
router.put("/:id", protect, validate(updateProjectSchema), updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
