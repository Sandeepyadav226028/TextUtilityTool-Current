require("./loadEnv");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));

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
