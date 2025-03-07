import { BrowserRouter,Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import React, { useState } from "react";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./components/UserProfile";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";



function App() {
    const [products] = useState([
        { id: 1, name: "Product 1", price: 100, image: "https://rukminim2.flixcart.com/image/832/832/xif0q/shoe/t/e/l/8-assg1258o-abros-white-silver-grey-original-imagqzfjpxj2afv2.jpeg?q=70&crop=false", description: "Description for Product 1" },
        { id: 2, name: "Product 2", price: 200, image: "https://via.placeholder.com/150", description: "Description for Product 2" },
        { id: 3, name: "Product 3", price: 300, image: "https://via.placeholder.com/150", description: "Description for Product 3" }
    ]);


    return (
        <div className="app-content">
            <Navbar />
            <Routes>
                
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
                <Route path="/buy" element={<ProtectedRoute><Buy /></ProtectedRoute>} />  
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                <Route path="/" element={<ProductList products={products} />} />
                <Route path="/product/:id" element={<ProductDetails products={products} />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;
