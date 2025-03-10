import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link} from "react-router-dom";

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
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="bg-white p-20 rounded-3xl shadow-lg w-96 text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-4 ">Login</h2>

                {error && <p className="text-red-500">{error}</p>}

                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-2 rounded-full border border-gray-300 shadow-md transition duration-300 ease-in-out hover:bg-gray-100 hover:shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.15 0 5.79 1.07 7.92 3.14l5.85-5.85C33.75 3.01 29.25 1 24 1 14.95 1 7.15 6.99 3.95 14.93l7.06 5.53C12.88 14.66 17.01 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.5 24.5c0-1.57-.14-3.09-.41-4.5H24v9h12.75c-.59 3-2.33 5.44-4.92 7.12l7.6 5.89c4.48-4.15 7.07-10.32 7.07-17.51z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.65 28.98C9.95 27.3 9.5 25.48 9.5 23.5c0-1.98.45-3.8 1.15-5.48l-7.07-5.54C1.35 16.02 0 19.64 0 23.5c0 3.86 1.35 7.48 3.57 10.52l7.08-5.04z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 47c5.97 0 10.98-1.98 14.63-5.35l-7.6-5.88c-2.02 1.36-4.55 2.16-7.03 2.16-7.02 0-12.17-4.7-14.05-10.96l-7.08 5.04C7.15 41.01 14.95 47 24 47z"
                    />
                  </svg>
                  <span className="text-lg">Login with Google</span>
                </button>
                <p className="mt-6">Don't have an account?<Link to="/register" className="text-blue-500"> Register now!</Link></p>
            </div>
        </div>
    );
};

export default Login;
