// tracker.controller.js
import jwt from "jsonwebtoken";
import { getIO } from "../services/socket.js";

const SECRET = process.env.JWT_SECRET || "secret";
const visitLog = new Map();

export const logPageVisit = (req, res) => {
  const token = req.cookies.pageview_token;
  const today = new Date().toDateString();
  let shouldCount = false;

  if (token) {
    try {
      jwt.verify(token, SECRET);
      const lastVisit = visitLog.get(token);
      if (!lastVisit || new Date(lastVisit).toDateString() !== today) {
        shouldCount = true;
      }
    } catch {
      shouldCount = true;
    }
  } else {
    shouldCount = true;
  }

  if (shouldCount) {
    const newToken = jwt.sign({ createdAt: Date.now() }, SECRET, {
      expiresIn: "1d",
    });
    visitLog.set(newToken, new Date());
    res.cookie("pageview_token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const count = Array.from(visitLog.values()).filter(
      (date) => new Date(date).toDateString() === today
    ).length;

    // 🔥 Emit to all clients
    getIO().emit("pageview-update", count);
  }

  res.status(200).json({ message: "Visit logged" });
};

export const getTodayVisits = (req, res) => {
  const today = new Date().toDateString();
  const count = Array.from(visitLog.values()).filter(
    (date) => new Date(date).toDateString() === today
  ).length;

  res.status(200).json({ count });
};
