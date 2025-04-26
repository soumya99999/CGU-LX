import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import ReactGA from "react-ga4";
import React, { useEffect } from "react";

//import pages
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

ReactGA.initialize("G-VTT700DPSY");
function App() {

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search 
    });
  }, [location]);
  
  return (
    <div className="relative">
      <div className={`app-content  pt-[57px] `}>
        <Navbar />
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
        <Footer />
      </div>
    </div>
  );
}

export default App;
