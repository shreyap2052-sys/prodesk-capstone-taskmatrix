const { z } = require("zod");

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.string().trim().email().max(100),
  password: z.string().min(8).max(128),
}).strict();

const loginSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().min(1).max(128),
}).strict();

const projectSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
}).strict();

const addMemberSchema = z.object({
  email: z.string().trim().email().max(100),
}).strict();

const updateProjectSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field is required"
);

const taskSchema = z.object({
  title: z.string().trim().min(2).max(150),
  description: z.string().trim().max(2000).optional(),
  project: objectId,
  assignedTo: objectId.optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().datetime().optional(),
}).strict();

const updateTaskSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().max(2000).optional(),
  assignedTo: objectId.nullable().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  deadline: z.string().datetime().nullable().optional(),
}).strict().refine(
  (data) => Object.keys(data).length > 0,
  "At least one field is required"
);

const notificationSchema = z.object({
  message: z.string().trim().min(1).max(500),
  type: z.enum(["task", "project", "team", "system"]).optional(),
}).strict();

const activitySchema = z.object({
  project: objectId,
  action: z.string().trim().min(1).max(300),
  task: objectId.optional(),
}).strict();

const aiSchema = z.object({
  taskIdea: z.string().trim().min(5).max(2000),
}).strict();

module.exports = {
  registerSchema,
  loginSchema,
  projectSchema,
  addMemberSchema,
  updateProjectSchema,
  taskSchema,
  updateTaskSchema,
  notificationSchema,
  activitySchema,
  aiSchema,
};
