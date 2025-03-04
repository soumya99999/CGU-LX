import User from "../models/User.js";
import admin from "firebase-admin";
import fs from "fs";

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync("./config/firebaseAdminConfig.json", "utf-8"));

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const googleLogin = async (req, res) => {
    console.log("📩 Received Request on /google-login");
    console.log("📦 Full Request Body:", req.body);

    // Extract token from body or headers
    const token = req.body.token || req.headers.authorization?.split(" ")[1];

    console.log("🔑 Extracted Token:", token);

    if (!token) {
        return res.status(400).json({ message: "Token is missing" });
    }

    try {
        // Verify the Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("✅ Decoded Token:", decodedToken);
        
        const { name, email, picture, phone_number } = decodedToken;

        // Ensure only CGU emails are allowed
        if (!email.endsWith("@cgu-odisha.ac.in")) {
            return res.status(403).json({ message: "Only CGU college emails are allowed." });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                avatar: picture,
                phoneNumber: phone_number || "Not provided",
            });
            await user.save();
        } else {
            if (!user.phoneNumber && phone_number) {
                user.phoneNumber = phone_number;
                await user.save();
            }
        }
        res.status(200).json({ success: true, message: "Login successful", user });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export default googleLogin;
