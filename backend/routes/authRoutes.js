import express from "express";
import admin from "firebase-admin";
import { googleLogin, googleRegister, getProfile, updateProfile } from "../controllers/authController.js";
import verifyFirebaseToken from "../middleware/verifyFirebaseToken.js";

const router = express.Router();

router.post("/google-login", googleLogin);
router.post("/google-register", googleRegister);  // ✅ FIXED: Added googleRegister route
router.get("/profile", verifyFirebaseToken, getProfile);
router.put("/profile", verifyFirebaseToken, updateProfile);

export default router;

