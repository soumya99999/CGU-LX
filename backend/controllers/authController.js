import admin from "firebase-admin";
import { auth } from "../config/firebase-config.js"; // Ensure correct path
import User from "../models/User.js";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.applicationDefault(), // Or use service account credentials
    });
}


export const googleLogin = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        console.log("🔍 Received Token:", token); // Log token

        // ✅ Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("✅ Decoded Token:", decodedToken); // Log decoded data

        const { email, name, picture } = decodedToken;

        // 🔍 Search for user by email
        let user = await User.findOne({ email });

        // ❌ If user is not found, return 307 to redirect to registration
        if (!user) {
            return res.status(307).json({ success: false, message: "User not registered. Redirect to register." });
        }

        // ✅ Return user data along with Firebase decodedToken
        return res.json({ success: true, token, user: { ...user.toObject(), ...decodedToken } });

    } catch (error) {
        console.error("🚨 Token Verification Error:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const googleRegister = async (req, res) => {
    try {
        const { name, email, phone, course, semester } = req.body;

        if (!name || !email || !phone || !course || !semester) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already registered." });
        }
        

        const newUser = new User({ name, email, phone, course, semester });
        await newUser.save();

        return res.json({ success: true, message: "User  successfully!" });
    } catch (error) {
        console.error("❌ Google Register Error:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again later." });
    }
};

export const getProfile = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const user = await User.findOne({ email: req.user.email }).select(
            "name phone course semester email profilePicture"
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


export const updateProfile = async (req, res) => {
    if (!req.user || !req.user.email) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    try {
        const { semester, avatar } = req.body; // Extract semester & avatar fields

        const updatedFields = {};
        if (semester) updatedFields.semester = semester;
        if (avatar) updatedFields.avatar = avatar; // ✅ Allow avatar update

        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            { $set: updatedFields },
            { new: true, select: "semester avatar" } // Return updated fields
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ 
            success: true, 
            message: "Profile updated!", 
            semester: updatedUser.semester, 
            avatar: updatedUser.avatar 
        });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
