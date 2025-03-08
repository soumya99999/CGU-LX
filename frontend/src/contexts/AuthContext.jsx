import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const token = await currentUser.getIdToken(); // Get Firebase ID token
                    console.log("📤 Sending Token:", token);
<<<<<<< HEAD:frontend/src/context/AuthContext.jsx

=======
    
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81:frontend/src/contexts/AuthContext.jsx
                    const res = await fetch("http://localhost:5000/api/auth/google-login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token }),
                    });
<<<<<<< HEAD:frontend/src/context/AuthContext.jsx

=======
    
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81:frontend/src/contexts/AuthContext.jsx
                    const data = await res.json();
                    if (res.ok) {
                        console.log("✅ Backend Login Success:", data);
                        localStorage.setItem("token", token);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        setUser(data.user);
                    } else {
<<<<<<< HEAD:frontend/src/context/AuthContext.jsx
                        console.error("🚨 Backend Login Failed:", data);
                        await logout();
=======
                        console.error("Login Failed:", data.message);
                        await logout();  // Ensure logout is awaited properly
>>>>>>> c4114f99194437ff9ad2e33db83c366dba76bd81:frontend/src/contexts/AuthContext.jsx
                    }
                } catch (error) {
                    console.error("Auth Error:", error);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result; // ✅ Ensure we return the result
        } catch (error) {
            console.error("🚨 Google Sign-In Error:", error);
            return null; // Return null if sign-in fails
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
