import admin from "../config/firebase-config.js"; // Works with default export
import User from "../models/User.js"; // Import the User model

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email } = decodedToken;

        const user = await User.findOne({ firebaseUID: uid });

        if (!user) {
            return res.status(404).json({ message: "User not found. Please register first." });
        }

        return res.json({ token, user });
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};


export const googleRegister = async (req, res) => {
    try {
        const { name, email, phone, course, semester } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !course || !semester) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already registered." });
        }

        // Create new user
        const newUser = new User({ name, email, phone, course, semester });
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("❌ Google Register Error:", error);
        res.status(500).json({ success: false, message: "Server error, please try again later." });
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
        const user = await User.findOne({ firebaseUID: req.user.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedFields = {
            name: req.body.name || user.name,
            phone: req.body.phone || user.phone,
            course: req.body.course || user.course,
            semester: req.body.semester || user.semester,
        };

        const updatedUser = await User.findOneAndUpdate(
            { firebaseUID: req.user.id },
            { $set: updatedFields },
            { new: true }
        );

        return res.json({ message: "Profile updated successfully!", user: updatedUser });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


