import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext"; // Add this import
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { items } = useContext(CartContext); // Access cart items
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Calculate total number of items in cart (sum of quantities)
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-3xl font-extrabold tracking-wide" onClick={() => setMenuOpen(false)}>
          CGU <span className="text-yellow-400">Marketplace</span>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/buy" className="hover:text-yellow-300 transition transform hover:scale-105">Buy</Link>
          <Link to="/sell" className="hover:text-yellow-300 transition transform hover:scale-105">Sell</Link>
          <Link to="/cart" className="hover:text-yellow-300 transition transform hover:scale-105 relative">
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="hover:text-yellow-300 transition transform hover:scale-105">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-5 py-2 rounded-full hover:bg-red-600 transition transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-green-500 px-5 py-2 rounded-full text-white font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105 shadow-lg">
                Login
              </Link>
              <Link to="/register" className="bg-yellow-400 px-5 py-2 rounded-full hover:bg-yellow-500 transition transform hover:scale-105 shadow-lg">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden flex flex-col items-center mt-3 space-y-4 bg-blue-600 py-4 rounded-lg shadow-xl"
        >
          <Link to="/buy" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition transform hover:scale-105">Buy</Link>
          <Link to="/sell" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition transform hover:scale-105">Sell</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition transform hover:scale-105 relative">
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300 transition transform hover:scale-105">Profile</Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-5 py-2 rounded-full hover:bg-red-600 transition transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="bg-green-500 px-5 py-2 rounded-full text-white font-semibold hover:bg-green-600 transition duration-300 transform hover:scale-105 shadow-lg">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-yellow-400 px-5 py-2 rounded-full hover:bg-yellow-500 transition transform hover:scale-105 shadow-lg">
                Register
              </Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
