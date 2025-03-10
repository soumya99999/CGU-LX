import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken(); // ✅ Get the Firebase ID token

            // Send token to backend
            const response = await fetch("http://localhost:5000/api/auth/google-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`, // ✅ Send token in Authorization header
                },
                body: JSON.stringify({ email: user.email, name: user.displayName }),
            });

            const data = await response.json();
            if (data.success) {
                console.log("✅ User logged in successfully!");
                navigate("/");
            } else {
                setError(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("❌ Google Login Error:", error.message);
            setError("Google Login failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Login</h2>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
