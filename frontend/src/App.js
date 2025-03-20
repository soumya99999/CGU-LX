import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
<<<<<<< HEAD
import React from "react";
=======
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> 7fc2afe7c958882eb1b6ee26a70866b818189a96

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
<<<<<<< HEAD
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <div className="app-content bg-gray-100 pt-[40px]">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <Sell />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buy"
          element={
            <ProtectedRoute>
              <Buy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute>
            <EditProduct />
          </ProtectedRoute>
          }
          />
      </Routes>
      <Footer />
=======
import About from "./components/About";
import Terms from "./components/terms";
import Privacy from "./components/privacy";
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
      <div className={`app-content bg-gray-200 pt-[55px]  transition-opacity duration-[1000ms] ease-in-out ${fade ? "opacity-0" : "opacity-100"}`}>
        <Navbar />
        {showContent && (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
            <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        )}
        <Footer />
      </div>
>>>>>>> 7fc2afe7c958882eb1b6ee26a70866b818189a96
    </div>
  );
}

export default App;
