import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import {
  DndContext,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";


function DraggableTask({
  task,
  lockOwner,
  socketId,
  onToggleLock,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  const isLocked = Boolean(lockOwner);
  const lockedByMe = lockOwner === socketId;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none bg-white rounded-xl p-4 shadow-sm transition ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Link
        to={`/tasks/${task._id}`}
        onClick={(event) => {
          if (isDragging) {
            event.preventDefault();
          }
        }}
        className="block cursor-grab active:cursor-grabbing"
      >
        <h3 className="font-semibold text-gray-800 break-words">
          {task.title}
        </h3>

        <p className="text-xs text-gray-500 mt-2 break-words">
          {task.project?.name || "No project"}
        </p>

        <div className="mt-3">
          <span
            className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority
              ? task.priority.charAt(0).toUpperCase() +
                task.priority.slice(1)
              : "Medium"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="w-8 h-8 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {task.assignedTo?.name
              ? task.assignedTo.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "NA"}
          </div>

          <span className="text-xs text-gray-500 text-right">
            {task.deadline
              ? `Due ${new Date(task.deadline).toLocaleDateString()}`
              : "No deadline"}
          </span>
        </div>
      </Link>

      <div className="mt-4 pt-3 border-t">
        {isLocked && (
          <p className="text-xs text-gray-500 mb-2">
            {lockedByMe
              ? "You currently hold this lock"
              : `Locked by another agent (${lockOwner.slice(0, 6)})`}
          </p>
        )}

        <button
          type="button"
          disabled={isLocked && !lockedByMe}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleLock(task._id, lockedByMe);
          }}
          className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition ${
            lockedByMe
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : isLocked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100"
          }`}
        >
          {lockedByMe
            ? "🔓 Unlock Ticket"
            : isLocked
            ? "🔒 Locked"
            : "🔒 Lock Ticket"}
        </button>
      </div>
    </div>
  );
}


function DroppableColumn({
  column,
  tasks,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-4 min-h-[300px] w-[280px] sm:w-auto shrink-0 transition ${
        isOver ? "bg-blue-100" : "bg-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {column.title}
        </h2>

        <span className="bg-white text-gray-600 text-sm px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            Drop tasks here
          </p>
        )}

        {tasks.map((task) => (
          <DraggableTask
  key={task._id}
  task={task}
  lockOwner={ticketLocks[String(task._id)]}
  socketId={socketId}
  onToggleLock={handleToggleLock}
/>
        ))}
      </div>
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [ticketLocks, setTicketLocks] = useState({});
const [socketId, setSocketId] = useState("");

const socketRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [aiIdea, setAiIdea] = useState("");
const [generatingAI, setGeneratingAI] = useState(false);
const [aiResult, setAiResult] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    status: "todo",
    priority: "medium",
    deadline: "",
  });

  const [updatingTaskId, setUpdatingTaskId] =
    useState(null);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(response.data.tasks || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(
        response.data.projects || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load projects."
      );
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleToggleLock = (ticketId, lockedByMe) => {
  const socket = socketRef.current;

  if (!socket?.connected) {
    setError("Socket connection unavailable. Please try again.");
    return;
  }

  setError("");

  if (lockedByMe) {
    socket.emit("unlock_ticket", String(ticketId));
  } else {
    socket.emit("lock_ticket", String(ticketId));
  }
};

  
// Real-time task updates and ticket locking
useEffect(() => {
  const socket = io(API_URL, {
    withCredentials: true,
  });

  socketRef.current = socket;

  socket.on("connect", () => {
    console.log("Ticket dashboard connected:", socket.id);

    setSocketId(socket.id);

    socket.emit("join_dashboard");
  });

  socket.on("disconnect", () => {
    console.log("Ticket dashboard disconnected");
    setSocketId("");
  });

  // Receive all existing ticket locks
  socket.on("current_locks", (locks) => {
    const lockMap = {};

    locks.forEach(({ ticketId, socketId }) => {
      lockMap[ticketId] = socketId;
    });

    setTicketLocks(lockMap);
  });

  // Receive a newly created lock
  socket.on("ticket_locked", ({ ticketId, socketId }) => {
    setTicketLocks((current) => ({
      ...current,
      [ticketId]: socketId,
    }));
  });

  // Receive an unlock or automatic ghost-lock release
  socket.on("ticket_unlocked", ({ ticketId }) => {
    setTicketLocks((current) => {
      const updated = { ...current };
      delete updated[ticketId];
      return updated;
    });
  });

  socket.on("lock_rejected", ({ message }) => {
    setError(message);
  });

  socket.on("unlock_rejected", ({ message }) => {
    setError(message);
  });

  // Preserve existing task update functionality
  socket.on("taskUpdated", (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === updatedTask.taskId
          ? {
              ...task,
              status: updatedTask.status,
              priority: updatedTask.priority,
              assignedTo: updatedTask.assignedTo,
            }
          : task
      )
    );
  });

  return () => {
    socket.disconnect();
    socketRef.current = null;
  };
}, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,

      ...(name === "project" && {
        assignedTo: "",
      }),
    });
  };

  const handleGenerateAI = async () => {
  if (aiIdea.trim().length < 5) {
    setError("Please enter a task idea with at least 5 characters.");
    return;
  }

  setGeneratingAI(true);
  setError("");
  setAiResult("");

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/api/ai/generate-task`,
      { taskIdea: aiIdea },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAiResult(response.data.result || "No result generated.");
  } catch (error) {
    setError(
      error.response?.data?.message || "Failed to generate AI task."
    );
  } finally {
    setGeneratingAI(false);
  }
};

  const handleCreateTask = async (event) => {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/tasks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        status: "todo",
        priority: "medium",
        deadline: "",
      });

      setShowForm(false);

      await fetchTasks();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setCreating(false);
    }
  };

  // Update task status after drag and drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const taskId = active.id;
    const newStatus = over.id;

    const validStatuses = [
      "todo",
      "in-progress",
      "done",
    ];

    if (!validStatuses.includes(newStatus)) {
      return;
    }

    const currentTask = tasks.find(
      (task) => task._id === taskId
    );

    if (!currentTask) {
      return;
    }

    if (currentTask.status === newStatus) {
      return;
    }

    const previousStatus = currentTask.status;

    // Update UI immediately
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    setUpdatingTaskId(taskId);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // Restore previous status if API update fails
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: previousStatus,
              }
            : task
        )
      );

      setError(
        error.response?.data?.message ||
          "Failed to update task status."
      );
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Get selected project
  const selectedProject = projects.find(
    (project) => project._id === formData.project
  );

  // Get project members
  const projectMembers = selectedProject
    ? [
        ...(selectedProject.owner
          ? [selectedProject.owner]
          : []),
        ...(selectedProject.members || []),
      ].filter(
        (member, index, array) =>
          member?._id &&
          array.findIndex(
            (item) => item._id === member._id
          ) === index
      )
    : [];

  const columns = [
    {
      title: "To Do",
      status: "todo",
    },
    {
      title: "In Progress",
      status: "in-progress",
    },
    {
      title: "Done",
      status: "done",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Tasks
          </h1>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage tasks using the Kanban board
          </p>
        </div>

        <button
          onClick={() =>
            setShowForm(!showForm)
          }
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {showForm ? "Close" : "+ New Task"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Updating indicator */}
      {updatingTaskId && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg px-4 py-3 text-sm sm:text-base">
          Updating task status...
        </div>
      )}

      {/* Create Task Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-5">
            Create New Task
          </h2>

          <form
            onSubmit={handleCreateTask}
            className="space-y-5"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-5 space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
  <div>
    <h3 className="font-semibold text-gray-800">AI Task Generator</h3>
    <p className="text-sm text-gray-600">
      Describe your task idea and let AI create a structured task.
    </p>
  </div>

  <textarea
    value={aiIdea}
    onChange={(e) => setAiIdea(e.target.value)}
    placeholder="Example: Plan and launch a new product website..."
    rows={3}
    className="w-full rounded-lg border border-gray-300 p-3 text-sm"
  />

  <button
    type="button"
    onClick={handleGenerateAI}
    disabled={generatingAI || aiIdea.trim().length < 5}
    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
  >
    {generatingAI ? "Generating..." : "Generate with AI"}
  </button>

  {aiResult && (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <h4 className="mb-2 font-medium text-gray-800">AI Suggestion</h4>

      <p className="whitespace-pre-wrap text-sm text-gray-700">
        {aiResult}
      </p>

      <button
        type="button"
        onClick={() =>
          setFormData((current) => ({
            ...current,
            description: aiResult,
          }))
        }
        className="mt-3 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
      >
        Use as Description
      </button>
    </div>
  )}
</div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
                rows="4"
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>

              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">
                  Select a project
                </option>

                {projects.map((project) => (
                  <option
                    key={project._id}
                    value={project._id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned To
              </label>

              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={!formData.project}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.project
                    ? "Select a team member"
                    : "Select a project first"}
                </option>

                {projectMembers.map((member) => (
                  <option
                    key={member._id}
                    value={member._id}
                  >
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="todo">
                  To Do
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="done">
                  Done
                </option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={creating}
                className="w-full sm:w-auto bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating
                  ? "Creating..."
                  : "Create Task"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-5 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">
          Loading tasks...
        </p>
      )}

      {/* Kanban Board */}
      {!loading && !error && (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4">
            {columns.map((column) => {
              const columnTasks = tasks.filter(
                (task) =>
                  task.status === column.status
              );

              return (
                <DroppableColumn
                  key={column.status}
                  column={column}
                  tasks={columnTasks}
                />
              );
            })}
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default Tasks;

