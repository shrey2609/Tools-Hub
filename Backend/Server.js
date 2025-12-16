// Backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from 'body-parser';

import toolRoutes from "./routes/ToolRoutes.js";
import accessRoutes from "./routes/accessRoutes.js"


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Serve static files from Public/Image folder
const __dirname = path.resolve();
app.use("/Image", express.static(path.join(__dirname, "Public/Image")));



// Routes
app.use("/api/tools", toolRoutes);
app.use("/api/access", accessRoutes)



// Health check
app.get("/", (req, res) => res.send("✅ Backend server is running"));

// MongoDB connection - removed deprecated options
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({
    message: "Something went wrong", 
    error: err.message,
  });
});

