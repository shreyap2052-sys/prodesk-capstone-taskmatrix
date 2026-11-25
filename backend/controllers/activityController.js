const Activity = require("../models/Activity");
const Project = require("../models/Project");

// Create a new activity
const createActivity = async (req, res, next) => {
  try {
    const { project, action, task } = req.body;

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      projectExists.owner.toString() === req.user._id.toString() ||
      projectExists.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create activity",
      });
    }

    const activity = await Activity.create({
      project,
      user: req.user._id,
      action,
      task,
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate("user", "name email")
      .populate("task", "title")
      .populate("project", "name");

    return res.status(201).json({
      success: true,
      message: "Activity created successfully",
      activity: populatedActivity,
    });
  } catch (error) {
    next(error);
  }
};

// Get activities for user's projects
const getActivities = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    const activities = await Activity.find({
      project: { $in: projectIds },
    })
      .populate("user", "name email")
      .populate("task", "title")
      .populate("project", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createActivity,
  getActivities,
};
