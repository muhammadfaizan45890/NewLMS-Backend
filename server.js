import express from "express";
import "dotenv/config";
import cors from "cors";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./database/db.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";
import enrollRoutes from "./routes/enrollRoutes.js";
import moduleRoutes from "./routes/moduleRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import certificateRoutes from "./routes/certificateRoutes.js";

import "./config/passport.js";

// ------------------------------------------------------------
// 1. Setup __dirname for ES modules
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------
// 2. Middleware (order matters)
// ------------------------------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://lms-courseacademy.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(passport.initialize());

// ✅ Serve static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use("/files", express.static(path.join(__dirname, "public/files"))); // for notes & other uploads

// ------------------------------------------------------------
// 3. Routes (no duplicates)
// ------------------------------------------------------------
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/enroll", enrollRoutes);        // ✅ only once
app.use("/api/modules", moduleRoutes);
app.use("/refund", refundRoutes);
app.use("/notes", notesRoutes);
app.use("/certificate", certificateRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server running" });
});

// ------------------------------------------------------------
// 4. 404 handler – catch unknown routes
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ------------------------------------------------------------
// 5. Global error handler (catches all sync/async errors)
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Multer errors are forwarded from the route middleware
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Default 500
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// ------------------------------------------------------------
// 6. Start server
// ------------------------------------------------------------
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Database connected");

    console.log(`🔧 CLIENT_URL: ${process.env.CLIENT_URL || "https://lms-courseacademy.vercel.app/"}`);
    console.log(
      `🔑 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? "Loaded ✅" : "Missing ❌"}`
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
