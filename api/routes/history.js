const express = require("express");
const jwt = require("jsonwebtoken");
const History = require("../models/History");
const { jwtSecret } = require("../config");

const router = express.Router();
const MAX_HISTORY_LENGTH = 10000;

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  return jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    req.user = user;
    return next();
  });
}

router.post("/", authenticateToken, async (req, res) => {
  try {
    const content = req.body.content?.trim();

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (content.length > MAX_HISTORY_LENGTH) {
      return res.status(400).json({ error: "Content is too long to save" });
    }

    const newHistory = new History({
      userId: req.user.id,
      content,
    });

    await newHistory.save();
    return res.json({ message: "History saved" });
  } catch (err) {
    console.error("Failed to save history:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const history = await History.find(
      { userId: req.user.id },
      { content: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json(history);
  } catch (err) {
    console.error("Failed to fetch history:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
