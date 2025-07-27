import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cors from "cors";
import trackerRouter, { ioEmitVisit } from "./routes/tracker.route.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://your-frontend.com"],
    credentials: true,
  },
});
// ✅ Parse comma-separated origins from .env
const allowedOrigins = process.env.CORS_ORIGINS?.split(",").map((origin) =>
  origin.trim()
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Share `io` with controller via export
export const ioInstance = io;

app.use("/api", trackerRouter);

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
