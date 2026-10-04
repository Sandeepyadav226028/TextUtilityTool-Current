require("./loadEnv");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");

const app = express();

app.disable("x-powered-by");

// Manual CORS middleware (cors package has issues with Express 5)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || config.allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

  // Respond immediately to preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(express.json({ limit: "16kb" }));

// Debug: log all incoming requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Debug: test route
app.get("/test", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
