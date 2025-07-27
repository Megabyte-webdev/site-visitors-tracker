// socket.js
import { Server } from "socket.io";
import http from "http";

let io = null;

export const initSocket = (app, corsOrigins) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
  });

  return server;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
