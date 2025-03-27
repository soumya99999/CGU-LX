import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import firebaseAdmin from "./config/firebase-config.js"; // ✅ Import Firebase Config

dotenv.config();

const app = express();

app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data



app.use(
  cors({
    // origin: "http://localhost:3000", // ✅ Correct origin
    origin: origin: "https://cgumarketplace.vercel.app",
    credentials: true, // ✅ If using cookies or sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ✅ Middleware for authentication
app.post("/api/auth/google-login", async (req, res) => {
  console.log("🟢 Received Headers:", req.headers);

  if (!req.headers.authorization) {
    return res.status(401).json({ error: "Missing Authorization Header" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");
  console.log("🟢 Extracted Token:", token);

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    console.log("✅ Token Verified:", decodedToken);
    res.json({ message: "User authenticated", uid: decodedToken.uid });
  } catch (error) {
    console.error("🔴 Firebase Token Verification Failed:", error.message);
    res.status(401).json({ error: "Invalid Token", details: error.message });
  }
});

app.use(errorHandler);

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "CGU_LX",
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// ✅ Start Server
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000; // ✅ Added Default Port
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
