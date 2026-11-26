
let io;

// In-memory ticket lock storage
// Key: ticketId, Value: socket.id
const ticketLocks = new Map();

const initSocket = (server) => {
  const { Server } = require("socket.io");

  const frontendURL = process.env.FRONTEND_URL;

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || origin === frontendURL) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by Socket.IO CORS"));
      },
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join ticket dashboard
    socket.on("join_dashboard", () => {
      socket.join("ticket_dashboard");

      socket.emit("current_locks", Array.from(ticketLocks.entries()).map(
        ([ticketId, socketId]) => ({
          ticketId,
          socketId,
        })
      ));

      console.log(`Socket ${socket.id} joined dashboard`);
    });

    // Lock a ticket
    socket.on("lock_ticket", (ticketId) => {
      if (!ticketId || typeof ticketId !== "string") {
        return socket.emit("lock_rejected", {
          ticketId,
          message: "Invalid ticket ID",
        });
      }

      const existingLock = ticketLocks.get(ticketId);

      if (existingLock) {
        return socket.emit("lock_rejected", {
          ticketId,
          message: "Ticket is already locked",
        });
      }

      ticketLocks.set(ticketId, socket.id);

      console.log(`${ticketId} locked by ${socket.id}`);

      // Broadcast updated lock state to all connected clients
      io.emit("ticket_locked", {
        ticketId,
        socketId: socket.id,
      });
    });

    // Unlock a ticket
    socket.on("unlock_ticket", (ticketId) => {
      if (!ticketId || typeof ticketId !== "string") {
        return;
      }

      const existingLock = ticketLocks.get(ticketId);

      // Only the socket that owns the lock can release it
      if (existingLock !== socket.id) {
        return socket.emit("unlock_rejected", {
          ticketId,
          message: "You do not own this ticket lock",
        });
      }

      ticketLocks.delete(ticketId);

      console.log(`${ticketId} unlocked by ${socket.id}`);

      io.emit("ticket_unlocked", {
        ticketId,
        socketId: socket.id,
      });
    });

    // Ghost disconnect handler
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [ticketId, socketId] of ticketLocks.entries()) {
        if (socketId === socket.id) {
          ticketLocks.delete(ticketId);

          console.log(
            `Ghost lock released: ${ticketId} (owner disconnected)`
          );

          io.emit("ticket_unlocked", {
            ticketId,
            socketId: socket.id,
            reason: "owner_disconnected",
          });
        }
      }
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
  ticketLocks,
};
