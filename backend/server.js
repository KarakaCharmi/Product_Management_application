// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productsRouter from "./routes/products.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.get("/", (_req, res) => res.send("API running"));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/productsdb";
const DB_NAME = process.env.MONGO_DB || "productsdb";

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

export default app;
