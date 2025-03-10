import admin from "firebase-admin";

// Middleware to verify Firebase Auth Token
const verifyFirebaseToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided." });
        }

        // ✅ Verify token with Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // ✅ Attach user data to request
        next();
    } catch (error) {
        console.error("❌ Firebase Token Verification Error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default verifyFirebaseToken;
