import { config } from "dotenv";
import express from "express";
import trackerRouter from "./routes/tracker.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
config();
const port = process.env.PORT;
const app = express();

app.use(express.json());

// Enable CORS for your frontend origin
app.use(
  cors({
    origin: "http://localhost:5173", // allow frontend
    credentials: true, // allow cookies (important if using JWT in cookies)
  })
);
app.use(cookieParser());

app.use("/api", trackerRouter);

app.listen(port, () => {
  console.log(`Website Tracker running on port ${port}`);
});
