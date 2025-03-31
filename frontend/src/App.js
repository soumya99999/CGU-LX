import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import EditProduct from "./pages/EditProduct";
import About from "./components/About";
import Terms from "./components/terms";
import Privacy from "./components/privacy";
import HowItWorks from "./components/HowItWorks";
import CommunityGuidelines from "./components/CommunityGuidelines";
function App() {
  const [fade, setFade] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setFade(true);
    setShowContent(false);

    const fadeOutTimeout = setTimeout(() => {
      setShowContent(true);
      setFade(false);
    }, 600);

    return () => clearTimeout(fadeOutTimeout);
  }, [location]);

  return (
    <div className="relative">
      {/* Blurred transition overlay */}
      <div 
        className={`fixed inset-0 bg-white/80 backdrop-blur-lg transition-opacity duration-[800ms] ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        } pointer-events-none z-50`}
      ></div>

      {/* Smooth fade for content */}
      <div className={`app-content  pt-[57px]  transition-opacity duration-[1000ms] ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}>
        <Navbar />
        {showContent && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/community-guidelines" element={<CommunityGuidelines />} />
            <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
            <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/edit-product/:productId" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
          </Routes>
        )}
        <Footer />
      </div>
    </div>
  );
}

export default App;
