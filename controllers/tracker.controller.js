import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secret";
const visitLog = new Map(); // key: token, value: Date

export const logPageVisit = (req, res) => {
  const token = req.cookies.pageview_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      const existingDate = visitLog.get(token);
      const today = new Date().toDateString();

      if (!existingDate || new Date(existingDate).toDateString() !== today) {
        visitLog.set(token, new Date());
      }
    } catch (err) {
      // Invalid token — issue new
      const newToken = jwt.sign({ createdAt: Date.now() }, SECRET);
      visitLog.set(newToken, new Date());
      res.cookie("pageview_token", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
  } else {
    const newToken = jwt.sign({ createdAt: Date.now() }, SECRET);
    visitLog.set(newToken, new Date());
    res.cookie("pageview_token", newToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
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
