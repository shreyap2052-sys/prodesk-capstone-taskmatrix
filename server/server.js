
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Basic health check
app.get("/", (req, res) => {
  res.json({ message: "TaskMatrix Auth API is running" });
});

// Registration and login routes
app.use("/api/auth", authRoutes);

// Protected test endpoint
app.get("/api/tasks", authMiddleware, (req, res) => {
  res.json({
    message: "You accessed the protected TaskMatrix endpoint",
    userId: req.userId,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
