import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  // Check if API_BASE_URL is defined
  if (!API_BASE_URL) {
    console.error("❌ REACT_APP_BACKEND_URL is not defined in .env");
  }

  // Check authentication state on app load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          console.log("📤 Sending Token:", token);

          const res = await fetch("http://localhost:5000/api/auth/google-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // Handle non-JSON responses
          if (!res.ok) {
            const text = await res.text();
            console.error("🚨 Backend Response (Text):", text);
            throw new Error("Backend returned an error: " + text);
          }

          const data = await res.json();
          console.log("Backend Response Data:", data); // Debugging line

          if (res.status === 307) {
            console.warn("🚨 User not registered. Redirecting...");

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);

            navigate("/register", {
              state: {
                email: currentUser.email,
                name: currentUser.displayName,
                picture: currentUser.photoURL,
              },
            });
          } else if (res.ok) {
            console.log("✅ Backend Login Success:", data);

            // Merge Firebase user data with backend user data
            const userData = {
              ...data.user,
              getIdToken: () => Promise.resolve(token), // Add getIdToken method
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData); // Set the merged user object
          } else {
            console.error("🚨 Backend Login Failed:", data);
            await logout();
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
  }, [navigate]);

  // Sign in with Google
  const signInWithGoogle = async (register = false, userData = {}) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const token = await user.getIdToken();
      const email = user.email;

      // Restrict login to college email
      if (!email.endsWith("@cgu-odisha.ac.in")) {
        await signOut(auth);
        console.warn("❌ Unauthorized Email: " + email);
        return { error: "❌ Use your college email to continue." };
      }

      const endpoint = register ? "google-register" : "google-login";
      const body = register
        ? JSON.stringify({ ...userData, name: user.displayName, email })
        : null;

      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body ? body : undefined,
      });

      // Handle non-JSON responses
      if (!res.ok) {
        const text = await res.text();
        console.error("🚨 Backend Response (Text):", text);
        throw new Error("Backend returned an error: " + text);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed.");
      }

      if (register && res.status === 409) {
        return { alreadyRegistered: true, message: "⚠️ You are already registered!" };
      }

      // Merge Firebase user data with backend user data
      const userData = {
        ...data.user,
        getIdToken: () => Promise.resolve(token), // Add getIdToken method
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); // Set the merged user object
      navigate("/");
      return data;
    } catch (error) {
      console.error("🚨 Google Auth Error:", error.message);
      return { error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};