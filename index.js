// server.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import trackerRouter from "./routes/tracker.route.js";
import { initSocket } from "./services/socket.js";

dotenv.config();

const app = express();

// Load allowed CORS origins from env
const allowedOrigins = process.env.CORS_ORIGINS?.split(",").map((o) =>
  o.trim()
);

// Middleware setup
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api", trackerRouter);

// Start HTTP + WebSocket server
const PORT = process.env.PORT || 10000;
const server = initSocket(app, allowedOrigins);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
