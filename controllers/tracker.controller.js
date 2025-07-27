import jwt from "jsonwebtoken";

const SECRET = process.env.PAGE_VIEW_SECRET || "pageview_secret";
const visitLog = {};

export const logPageVisit = (req, res) => {
  const token = req.cookies?.pageview_token;
  const today = new Date().toISOString().split("T")[0];

  if (token) {
    try {
      jwt.verify(token, SECRET); // valid token = already counted
      return res
        .status(200)
        .json({ success: false, message: "Already counted" });
    } catch {
      // Expired or invalid token — allow visit
    }
  }

  // Count today's visit
  visitLog[today] = (visitLog[today] || 0) + 1;

  // Set new token (1-day expiry)
  const newToken = jwt.sign({ visited: true }, SECRET, { expiresIn: "1d" });
  res.cookie("pageview_token", newToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({ success: true });
};

export const getTodayVisits = (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  res.json({ count: visitLog[today] || 0 });
};
