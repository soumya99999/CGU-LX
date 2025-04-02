import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import firebaseAdmin from "./config/firebase-config.js"; 
import axios from "axios";
// ✅ Import Firebase Config



const app = express();

app.use(express.json()); // Parses incoming JSON
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data



app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Correct origin
    // origin: "https://cgumarketplace.vercel.app",
    credentials: true, // ✅ If using cookies or sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);


app.post("/api/ai/generate-description", async (req, res) => {
  const { title, features } = req.body;

  // Validate input.
  if (!title || !features || typeof features !== "object" || features.length === 0) {
    return res.status(400).json({ error: "Title and features are required. Features should be an array." });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Missing Gemini API Key!");
    return res.status(500).json({ error: "AI API Key not found" });
  }

  try {
    const prompt = `Write a **concise and engaging** product description for a product titled: "${title}", highlighting these key features: ${features.join(", ")}. Keep it **under 50 words**, clear, and compelling, like a real product description you’d find on an e-commerce website.`;



    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("🔵 Gemini API Full Response:", response.data);

    // Extract description correctly
    const generatedDescription = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (generatedDescription) {
      res.json({ description: generatedDescription });
    } else {
      res.status(500).json({ error: "Failed to generate description. Invalid API response." });
    }

  } catch (error) {
    console.error("❌ Error generating description:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate description due to server error." });
  }
});



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
