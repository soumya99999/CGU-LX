import admin from "../config/firebase-config.js";
import User from "../models/User.js"; // Import the User model

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return res.json({ token, user: decodedToken });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findOne({ firebaseUID: req.user.id }); // Find user in DB

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            name: user.name || "",
            phone: user.phone || "",
            course: user.course || "",
            semester: user.semester || "",
            email: user.email || "",
            profilePicture: user.profilePicture || "",
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
export const updateProfile = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUID: req.user.id },  // Ensure this matches your DB field
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

