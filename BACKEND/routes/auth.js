const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const { jwtSecret } = require("../config");

const usernameRegex = /^[A-Za-z0-9_]{3,20}$/;
const passwordChecks = [
  (value) => value.length >= 6,
  (value) => /[A-Z]/.test(value),
  (value) => /[a-z]/.test(value),
  (value) => /[0-9]/.test(value),
  (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
];

function isStrongPassword(password) {
  return passwordChecks.every((check) => check(password));
}

router.post("/register", async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: "Username must be 3-20 characters and contain only letters, numbers, or _",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: "Password does not meet security requirements" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    return res.status(201).json({ success: true, message: "User registered" });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      username: user.username,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
