import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());  // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// origin: "http://localhost:3000",

app.use(
  cors({
    origin: "https://cgumarketplacee.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

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

// const startServer = async () => {
//   await connectDB();

//   const PORT = process.env.PORT||5000;
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// };

// startServer();
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

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



startServer();
