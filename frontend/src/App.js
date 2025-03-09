import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import React, { useState } from "react";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";

import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";


import Cart from "./pages/Cart"; // Add this import

function App() {

  return (
    <div className="app-content">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} /> {/* Add this route */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </div>
  );

}

export default App;