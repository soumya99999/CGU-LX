import express from "express";
import { googleLogin, getProfile, updateProfile } from "../controllers/authController.js";
import verifyFirebaseToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/google-login", googleLogin);
router.get("/profile", verifyFirebaseToken, getProfile);
router.put("/profile", verifyFirebaseToken, updateProfile);  // ✅ Fixed: Defined updateProfile

export default router;
