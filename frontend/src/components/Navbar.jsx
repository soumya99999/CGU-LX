import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { CartContext } from "../contexts/CartContext";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";


const linkVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  hover: { scale: 1.08, color: "#facc15", transition: { duration: 0.15 } },
};

const cartBadgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200 } },
};


// Button variants for hover and tap effects
const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 0px 8px rgba(0,0,0,0.3)", transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { items } = useContext(CartContext); // Access cart items

  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when route changes
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

  // Calculate total number of items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-4 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link to="/" className="text-3xl font-extrabold tracking-wide" onClick={() => setMenuOpen(false)}>
          CGU <span className="text-yellow-400">Marketplace</span>
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Mobile Menu">
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
        <Link to="/buy">
        <motion.button
          variants={{
            initial: {
              opacity: 0,
              y: -10,
              scale: 0.95,
              textShadow: "0px 0px 6px rgba(255, 215, 0, 0.7)",
              color: "#facc15",
            },
            animate: {
              opacity: 1,
              y: [-5, 5, -5], // **Smooth floating motion**
              scale: [1, 1.02, 1], // **Gentle pulsing**
              color: ["#facc15", "#ff6b6b", "#38bdf8", "#8a2be2", "#facc15"], // **Soft color transitions**
              textShadow: [
                "0px 0px 8px rgba(255, 215, 0, 0.7)",
                "0px 0px 12px rgba(255, 105, 180, 0.8)",
                "0px 0px 10px rgba(56, 189, 248, 0.8)",
                "0px 0px 12px rgba(138, 43, 226, 0.8)",
                "0px 0px 8px rgba(255, 215, 0, 0.7)",
              ],
              transition: {
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, // **Smooth floating animation**
                scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }, // **Soft pulsing effect**
                color: { repeat: Infinity, duration: 5, ease: "easeInOut" }, // **Slow color shift**
                textShadow: { repeat: Infinity, duration: 5, ease: "easeInOut" },
              },
            },
            hover: {
              scale: 1.1,
              rotate: [0, 1, -1, 1, 0], // **Slight smooth tilt effect**
              color: ["#ff6b6b", "#38bdf8", "#8a2be2", "#facc15"], // **Faster color transition on hover**
              textShadow: "0px 0px 15px rgba(255, 215, 0, 1)",
              transition: { duration: 0.5, ease: "easeInOut" },
            },
          }}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="px-3 py-1 font-bold text-lg uppercase tracking-widest rounded-full shadow-lg transition"
          style={{
            backgroundImage: "linear-gradient(90deg, #facc15, #ff6b6b, #38bdf8, #8a2be2)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            border: "2px solid #facc15",
          }}
        >
          BUY NOW
          
        </motion.button></Link>

        <Link to="/sell">
        <motion.button
          variants={linkVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          className="px-4 py-1 bg-background text-white font-bold rounded-full border-2 border-white transition duration-300 ease-in-out shadow-md hover:shadow-[0_0_15px_rgba(255,215,0,0.9)] hover:bg-background"
        >
          Sell
        </motion.button></Link>



      {/* <motion.div variants={linkVariants} initial="initial" animate="animate" whileHover="hover" className="relative">
        <Link to="/cart" className="transition transform">
          Cart
          {cartItemCount > 0 && (
            <motion.span
              variants={cartBadgeVariants}
              initial="initial"
              animate="animate"
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {cartItemCount}
            </motion.span>
          )}
        </Link>
      </motion.div> */}

          {user ? (
            <>
              <Link to="/profile" className="hover:text-yellow-300 transition transform hover:scale-105">Profile</Link>
              <motion.button
                variants={buttonVariants}
                initial={{ opacity: 0, y: -10 }} // Fade in with slight upward movement
                animate={{ opacity: 1, y: 0 }}   // Smoothly drop into place
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "#dc2626", // Slightly darker red on hover
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.15 } // Faster hover effect
                }} 
                whileTap={{ 
                  scale: 0.9, 
                  rotate: -2 // Slight tilt when clicked
                }} 
                onClick={handleLogout}
                className="bg-red-500 px-5 py-2 rounded-full text-white font-semibold transition shadow-lg"
              >
                Logout
              </motion.button>

            </>
          ) : (
            <>
              <motion.button
                variants={buttonVariants}
                initial={{ opacity: 0, y: -10 }} // Fade in with slight upward movement
                animate={{ opacity: 1, y: 0 }}   // Smoothly drop into place
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "#16a34a", 
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.1 } // Faster hover effect
                }} 
                whileTap={{ scale: 0.95 }} // Slightly shrink when clicked
                onClick={() => navigate("/login")}
                className="bg-green-500 px-5 py-2 rounded-full text-white font-semibold transition shadow-lg"
              >
                Login/Register
              </motion.button>


              {/* <motion.button
                variants={buttonVariants}
                initial={{ opacity: 0, y: -10 }} // Fade in with slight upward movement
                animate={{ opacity: 1, y: 0 }}   // Smoothly drop into place
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: "#facc15", // Slightly darker yellow
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  transition: { duration: 0.15 } // Faster hover effect
                }} 
                whileTap={{ scale: 0.95 }} // Slight shrink on click
                onClick={() => navigate("/register")}
                className="bg-yellow-400 px-5 py-2 rounded-full transition shadow-lg"
              >
                Register
              </motion.button> */}

            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="bg-red-500 px-5 py-2 rounded-full transition shadow-lg"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="bg-green-500 px-5 py-2 rounded-full text-white font-semibold transition shadow-lg"
                >
                  Login
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => { navigate("/register"); setMenuOpen(false); }}
                  className="bg-yellow-400 px-5 py-2 rounded-full transition shadow-lg"
                >
                  Register
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
