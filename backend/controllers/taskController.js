const Task = require("../models/Task");
const Project = require("../models/Project");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const { getIO } = require("../socket");

// Create a new task
const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      deadline,
    } = req.body;

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
        message: "Not authorized to create a task in this project",
      });
    }

    if (assignedTo) {
      const isAssigneeMember =
        projectExists.owner.toString() === assignedTo.toString() ||
        projectExists.members.some(
          (member) => member.toString() === assignedTo.toString()
        );

      if (!isAssigneeMember) {
        return res.status(400).json({
          success: false,
          message: "Assigned user must be a member of this project",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      status,
      priority,
      deadline,
    });

    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned the task "${title}".`,
        type: "task",
      });
    }

    await Activity.create({
      project,
      user: req.user._id,
      action: `created the task "${title}"`,
      task: task._id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tasks for the logged-in user's projects
const getTasks = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.user._id },
        { members: req.user._id },
      ],
    }).select("_id");

    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("project", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single task by ID
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name")
      .populate("assignedTo", "name email");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project._id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this task",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Update a task
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const {
      title,
      description,
      assignedTo,
      status,
      priority,
      deadline,
    } = req.body;

    const oldStatus = task.status;
    const oldAssignedTo = task.assignedTo
      ? task.assignedTo.toString()
      : null;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    if (assignedTo !== undefined) {
      if (assignedTo) {
        const isAssigneeMember =
          project.owner.toString() === assignedTo.toString() ||
          project.members.some(
            (member) => member.toString() === assignedTo.toString()
          );

        if (!isAssigneeMember) {
          return res.status(400).json({
            success: false,
            message: "Assigned user must be a member of this project",
          });
        }
      }

      task.assignedTo = assignedTo || null;
    }

    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (deadline !== undefined) task.deadline = deadline;

    await task.save();

    const io = getIO();

    io.emit("taskUpdated", {
      taskId: task._id,
      projectId: task.project,
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
    });

    if (status !== undefined && oldStatus !== status) {
      const statusNames = {
        todo: "To Do",
        "in-progress": "In Progress",
        done: "Done",
      };

      await Activity.create({
        project: task.project,
        user: req.user._id,
        action: `moved the task "${task.title}" to ${statusNames[status] || status}`,
        task: task._id,
      });
    }

    if (
      assignedTo !== undefined &&
      assignedTo &&
      oldAssignedTo !== assignedTo.toString()
    ) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned the task "${task.title}".`,
        type: "task",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() === req.user._id.toString() ||
      project.members.some(
        (member) => member.toString() === req.user._id.toString()
      );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
