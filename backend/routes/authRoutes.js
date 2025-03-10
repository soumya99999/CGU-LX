import express from "express";
import admin from "firebase-admin";
import { googleLogin, googleRegister, getProfile, updateProfile } from "../controllers/authController.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/google-register", googleRegister);  // ✅ FIXED: Added googleRegister route
router.get("/profile", verifyFirebaseToken, getProfile);
router.put("/profile", verifyFirebaseToken, updateProfile);



router.post("/google-login", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const token = authHeader.split(" ")[1]; // Extract token
      console.log("🔍 Received Token:", token); // Log token
  
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log("✅ Decoded Token:", decodedToken); // Log decoded data
  
      const { uid, email, name, picture } = decodedToken;
  
      // Return user data
      const user = { uid, email, name, picture };
      res.status(200).json({ message: "Login successful", user });
  
    } catch (error) {
      console.error("🚨 Token Verification Error:", error);
      res.status(401).json({ message: "Invalid token", error });
    }
  });

export default router;

