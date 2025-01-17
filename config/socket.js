// backend/config/socket.js
import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
      ],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Add helper functions for emitting task events
export const emitTaskEvent = {
  added: (task) => {
    if (io) {
      io.emit("taskAdded", {
        message: "Realtime Task add successful",
        task: task,
      });
    }
  },

  updated: (task) => {
    if (io) {
      io.emit("taskUpdated", {
        message: "Realtime Task update successful",
        task: task,
      });
    }
  },

  deleted: (taskId) => {
    if (io) {
      io.emit("taskDeleted", {
        message: "Realtime Task delete successful",
        taskId: taskId,
      });
    }
  },
};
