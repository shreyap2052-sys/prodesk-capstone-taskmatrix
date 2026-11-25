
let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");

  const frontendURL = process.env.FRONTEND_URL;

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || origin === frontendURL) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by Socket.IO CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

module.exports = {
  initSocket,
  getIO,
};
