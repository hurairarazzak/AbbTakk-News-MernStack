// server.js / index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import newsRoutes from "./routes/newsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// ✅ PORT automatically Railway assign karega
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: "https://abb-takk-website-full-clone.vercel.app", // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route (temporary)
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend alive ✅" });
});

// ✅ Routes
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);

// ✅ MongoDB connection with error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// ✅ Global error handler (optional, catches unhandled errors)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});