import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithGoogle();
      if (result) {
        console.log("✅ User logged in successfully!");
        navigate("/");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Google Login Error:", error.message);
      setError("Google Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white px-4">
      <div className="bg-white p-6 sm:p-10 md:p-16 rounded-3xl w-full max-w-sm md:max-w-md lg:max-w-lg text-center space-y-6 border-2 border-black shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Login</h2>

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-2 rounded-md border border-blue-300 shadow-md transition duration-300 ease-in-out hover:scale-95 hover:bg-blue-300 hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.15 0 5.79 1.07 7.92 3.14l5.85-5.85C33.75 3.01 29.25 1 24 1 14.95 1 7.15 6.99 3.95 14.93l7.06 5.53C12.88 14.66 17.01 9.5 24 9.5z" />
            <path fill="#34A853" d="M46.5 24.5c0-1.57-.14-3.09-.41-4.5H24v9h12.75c-.59 3-2.33 5.44-4.92 7.12l7.6 5.89c4.48-4.15 7.07-10.32 7.07-17.51z" />
            <path fill="#FBBC05" d="M10.65 28.98C9.95 27.3 9.5 25.48 9.5 23.5c0-1.98.45-3.8 1.15-5.48l-7.07-5.54C1.35 16.02 0 19.64 0 23.5c0 3.86 1.35 7.48 3.57 10.52l7.08-5.04z" />
            <path fill="#EA4335" d="M24 47c5.97 0 10.98-1.98 14.63-5.35l-7.6-5.88c-2.02 1.36-4.55 2.16-7.03 2.16-7.02 0-12.17-4.7-14.05-10.96l-7.08 5.04C7.15 41.01 14.95 47 24 47z" />
          </svg>
          <span className="text-lg">Login with Google</span>
        </button>

        <p className="text-gray-500 text-xs sm:text-sm">
          By logging in, you agree to the ridiculously long{" "}
          <Link to="/terms" className="text-blue-500 hover:text-blue-700">
            terms
          </Link>{" "}
          that you didn't bother to read!
        </p>

        <p className="mt-6 text-sm sm:text-md">
          Don't have an account?{" "}

        </p>
        <Link to="/register" className="text-blue-500 hover:text-blue-700 text-base sm:text-xl font-medium underline">
            Create Your Account!
          </Link>
      </div>
    </div>
  );
};

export default Login;
