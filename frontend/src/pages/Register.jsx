import { useState } from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [phone, setPhone] = useState("");
    const [course, setCourse] = useState("");
    const [semester, setSemester] = useState("1st Semester");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleRegister = async () => {
        setError("");
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const email = user.email;
            const name = user.displayName;
    
            // Restrict email domain
            if (!email.endsWith("@cgu-odisha.ac.in")) {
                setError("Use your college email (@cgu-odisha.ac.in) to register.");
                return;
            }
    
            // Send user data to backend
            const response = await fetch("http://localhost:5000/api/auth/google-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, course, semester }),
            });
    
            // ✅ Check if response is actually JSON
            if (!response.ok) {
                const errorText = await response.text(); // Read raw response
                console.error("❌ Backend Error:", errorText); 
                throw new Error(`Server Error: ${response.status} - ${errorText}`);
            }
    
            const data = await response.json();
            if (data.success) {
                console.log("✅ Registration successful!");
                navigate("/login");
            } else {
                setError(data.message || "Registration failed.");
            }
        } catch (error) {
            console.error("❌ Google Register Error:", error.message);
            setError("Google Sign-Up failed. Please try again.");
        }
    };
    

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Register</h2>

                {error && <p className="text-red-500">{error}</p>}

                <input
                    type="text"
                    placeholder="WhatsApp Registered Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                />

                <input
                    type="text"
                    placeholder="Course (e.g., B.Tech CSE)"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                />

                <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                >
                    {[...Array(8)].map((_, i) => (
                        <option key={i} value={`${i + 1}th Semester`}>
                            {`${i + 1}th Semester`}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleGoogleRegister}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
                >
                    Register with Google
                </button>
            </div>
        </div>
    );
};

export default Register;
