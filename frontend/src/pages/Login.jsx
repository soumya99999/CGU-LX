import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await signInWithGoogle();
            if (!result) {
                setError("Google Sign-In failed. Please try again.");
                setLoading(false);
                return;
            }

            const email = result.user.email;
            if (!email.endsWith("@cgu-odisha.ac.in")) {
                setError("Use your college email (@cgu-odisha.ac.in) to log in.");
                setLoading(false);
                return;
            }

            const idToken = await result.user.getIdToken();
            localStorage.setItem("token", idToken);

            const response = await fetch("http://localhost:5000/api/auth/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: idToken }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("✅ Backend Login Success:", data);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                console.error("🚨 Backend Login Failed:", data);
                setError(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("🚨 Google Sign-In Error:", error);
            setError("Google Sign-In failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Login</h2>

                {error && <p className="text-red-500">{error}</p>}

                {!user && (
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login with Google"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Login;
