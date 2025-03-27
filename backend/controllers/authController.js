import admin from "../config/firebase-config.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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
            return res.status(401).json({ success: false, message: "User not registered." });
        }

        // ✅ Return user data
        return res.json({ success: true, token, user });

    } catch (error) {
        console.error("🚨 Token Verification Error:", error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export const googleRegister = async (req, res) => {
    try {
        const { name, email, phone, course, semester, gender, username, bio, hostelite } = req.body;

        if (!name || !email || !phone || !course || !semester) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? "Email already registered" : "Username already taken"
            });
        }

        const newUser = new User({
            name,
            email,
            phone,
            course,
            semester,
            gender,
            username,
            bio,
            hostelite,
            joinedDate: new Date()
        });

        await newUser.save();

        // Generate token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                course: newUser.course,
                semester: newUser.semester,
                gender: newUser.gender,
                avatar: newUser.avatar,
                bio: newUser.bio,
                hostelite: newUser.hostelite,
                joinedDate: newUser.joinedDate
            }
        });
    } catch (error) {
        console.error("❌ Google Register Error:", error);
        return res.status(500).json({ success: false, message: "Server error, please try again later." });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, course, semester, gender, username, bio, hostelite } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? "Email already registered" : "Username already taken"
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            course,
            semester,
            gender,
            username,
            bio,
            hostelite,
            joinedDate: new Date()
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                course: user.course,
                semester: user.semester,
                gender: user.gender,
                avatar: user.avatar,
                bio: user.bio,
                hostelite: user.hostelite,
                joinedDate: user.joinedDate
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
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
