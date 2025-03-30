import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <motion.nav
      className="bg-white border-b border-blue-300 px-6 py-4 fixed top-0 w-full z-[100]"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center max-w-6xl px-2 mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-semibold tracking-tight text-black">
        <img src={require("../logo1.png")} alt="CGU Logo" className="h-8 w-8 object-contain" />          <span>
            <span className="text-blue-700">CGU</span>
            <span className="text-yellow-500">Marketplace</span>
          </span>
        </Link>


        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link to="/buy" className="text-gray-700 hover:text-black transition-colors text-md font-bold">Buy</Link>
          <Link to="/sell" className="text-gray-700 hover:text-black transition-colors text-md font-bold">Sell</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-gray-700 hover:text-black transition-colors text-md font-bold">Profile</Link>
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-gray-700 hover:scale-90 transition duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-black text-white px-4 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-gray-700 hover:scale-90 transition duration-200"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <svg className="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-14 left-0 w-full bg-white/90 backdrop-blur-lg rounded-b-2xl shadow-xl border-t border-gray-200 p-4 flex flex-col items-center gap-4"
          >
            <Link to="/buy" className="text-gray-700 hover:text-black text-sm font-medium transition" onClick={() => setMenuOpen(false)}>Buy</Link>
            <Link to="/sell" className="text-gray-700 hover:text-black text-sm font-medium transition" onClick={() => setMenuOpen(false)}>Sell</Link>
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-black text-sm font-medium transition" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium  hover:bg-gray-200 transition "
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium  hover:bg-gray-800 transition duration-200 hover:scale-95"
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
